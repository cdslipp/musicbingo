import type {
	AppMode,
	BingoCard,
	GameSimulation,
	RoundConfig,
	SimulationCard,
	Song,
	WinCondition,
	WinnerRecord
} from '../types.js';
import { parseCsv } from '../bingo/parse-csv.js';
import { generateCards } from '../bingo/generate-cards.js';
import { shuffle } from '../bingo/shuffle.js';
import { checkBingo } from '../bingo/check-bingo.js';
import { checkCardUniqueness, type UniquenessResult } from '../bingo/card-uniqueness.js';

// ── Core state ──
export const gameState = $state({
	songs: [] as Song[],
	cards: [] as BingoCard[],
	currentCardIndex: 0,
	numberOfCards: 50,
	bingoTitle: 'Music Bingo',
	selectedFont: 'Sans Serif' as string,
	baseFontSize: 16,
	mode: 'generate' as AppMode,
	tournamentRounds: [
		{ winCondition: 'row' },
		{ winCondition: 'four-corners' },
		{ winCondition: 'full-card' }
	] as RoundConfig[],
	cardUniqueness: null as UniquenessResult | null,

	// Simulation
	simulation: null as GameSimulation | null
});

// ── Derived ──
export function getFontFamily(): string {
	switch (gameState.selectedFont) {
		case 'Serif':
			return 'serif';
		case 'Monospace':
			return '"American Typewriter", Courier, monospace';
		default:
			return 'sans-serif';
	}
}

export function getUniqueSongCount(): number {
	return gameState.songs.length;
}

export function getCurrentWinCondition(): WinCondition {
	const sim = gameState.simulation;
	if (sim?.tournament) {
		const idx = Math.min(
			sim.tournament.currentRoundIndex,
			sim.tournament.rounds.length - 1
		);
		return sim.tournament.rounds[idx].winCondition;
	}
	return gameState.tournamentRounds[0]?.winCondition ?? 'standard';
}

// ── Actions ──
export function loadSongs(songs: Song[]): void {
	gameState.songs = songs;
	regenerateCards();
}

export function loadCsv(csvText: string): void {
	loadSongs(parseCsv(csvText));
}

export function regenerateCards(): void {
	if (gameState.songs.length >= 24) {
		gameState.cards = generateCards(gameState.songs, gameState.numberOfCards);
		gameState.currentCardIndex = 0;
		gameState.cardUniqueness = checkCardUniqueness(gameState.cards);
	}
}

export function prevCard(): void {
	if (gameState.currentCardIndex > 0) gameState.currentCardIndex--;
}

export function nextCard(): void {
	if (gameState.currentCardIndex < gameState.cards.length - 1) gameState.currentCardIndex++;
}

export function increaseFontSize(): void {
	if (gameState.baseFontSize < 30) gameState.baseFontSize++;
}

export function decreaseFontSize(): void {
	if (gameState.baseFontSize > 10) gameState.baseFontSize--;
}

// ── Tournament round management ──
export function addRound(winCondition: WinCondition): void {
	gameState.tournamentRounds = [...gameState.tournamentRounds, { winCondition }];
}

export function removeRound(index: number): void {
	if (gameState.tournamentRounds.length <= 1) return;
	gameState.tournamentRounds = gameState.tournamentRounds.filter((_, i) => i !== index);
}

export function updateRound(index: number, winCondition: WinCondition): void {
	gameState.tournamentRounds = gameState.tournamentRounds.map((r, i) =>
		i === index ? { winCondition } : r
	);
}

export function moveRound(index: number, direction: 'up' | 'down'): void {
	const target = direction === 'up' ? index - 1 : index + 1;
	if (target < 0 || target >= gameState.tournamentRounds.length) return;
	const rounds = [...gameState.tournamentRounds];
	[rounds[index], rounds[target]] = [rounds[target], rounds[index]];
	gameState.tournamentRounds = rounds;
}

// ── Simulation ──
function createSimCards(
	sourceCards: BingoCard[],
	excludeIds: number[] = []
): SimulationCard[] {
	const excluded = new Set(excludeIds);
	return sourceCards
		.filter((card) => !excluded.has(card.id))
		.map((card) => ({
			id: card.id,
			cells: card.cells.map((cell) => ({
				...cell,
				called: cell.isFree
			})),
			hasBingo: false,
			winningLine: null
		}));
}

export function startSimulation(order: 'random' | 'csv'): void {
	if (gameState.cards.length === 0) return;

	const callOrder = order === 'random' ? shuffle(gameState.songs) : [...gameState.songs];
	const cards = createSimCards(gameState.cards);

	const tournament = {
		rounds: [...gameState.tournamentRounds],
		currentRoundIndex: 0,
		roundResults: [],
		eliminatedCardIds: [] as number[],
		isComplete: false
	};

	gameState.simulation = {
		calledSongs: [],
		remainingSongs: [...callOrder],
		callOrder,
		cards,
		winners: [],
		winnerRecords: [],
		isComplete: false,
		currentCallIndex: 0,
		tournament
	};
	gameState.mode = 'simulate';
}

export function callNextSong(): void {
	const sim = gameState.simulation;
	if (!sim || sim.isComplete || sim.remainingSongs.length === 0) return;

	const song = sim.remainingSongs.shift()!;
	sim.calledSongs = [song, ...sim.calledSongs];
	sim.currentCallIndex++;

	const currentWinCondition = getCurrentWinCondition();
	const eliminated = sim.tournament
		? new Set(sim.tournament.eliminatedCardIds)
		: new Set<number>();

	for (const card of sim.cards) {
		if (card.hasBingo) continue;
		if (eliminated.has(card.id)) continue;

		const calledIndices = new Set<number>();
		for (let i = 0; i < card.cells.length; i++) {
			const cell = card.cells[i];
			if (cell.isFree) {
				cell.called = true;
				calledIndices.add(i);
				continue;
			}
			if (cell.song && cell.song.title === song.title) {
				cell.called = true;
			}
			if (cell.called) {
				calledIndices.add(i);
			}
		}

		const winningLine = checkBingo(calledIndices, currentWinCondition);
		if (winningLine) {
			card.hasBingo = true;
			card.winningLine = winningLine;
			sim.winners = [...sim.winners, card.id];
			sim.winnerRecords = [
				...sim.winnerRecords,
				{
					cardId: card.id,
					roundIndex: sim.tournament?.currentRoundIndex ?? 0,
					callIndex: sim.currentCallIndex,
					winningLine
				}
			];
		}
	}

	if (sim.winners.length > 0 || sim.remainingSongs.length === 0) {
		sim.isComplete = true;
	}
}

/** Call songs instantly until someone wins or songs run out. */
export function autoPlay(): void {
	const sim = gameState.simulation;
	if (!sim || sim.isComplete) return;

	while (!sim.isComplete && sim.remainingSongs.length > 0) {
		callNextSong();
	}
}

export function advanceToNextRound(): void {
	const sim = gameState.simulation;
	if (!sim?.tournament) return;

	const tournament = sim.tournament;
	const currentRound = tournament.rounds[tournament.currentRoundIndex];

	// Record round result
	const roundWinners = sim.winnerRecords.filter(
		(w) => w.roundIndex === tournament.currentRoundIndex
	);
	tournament.roundResults = [
		...tournament.roundResults,
		{
			roundIndex: tournament.currentRoundIndex,
			config: currentRound,
			winnerRecords: roundWinners,
			totalCalls: sim.currentCallIndex,
			calledSongs: [...sim.calledSongs]
		}
	];

	// Eliminate winners
	const newEliminated = roundWinners.map((w) => w.cardId);
	tournament.eliminatedCardIds = [...tournament.eliminatedCardIds, ...newEliminated];

	// Advance round
	tournament.currentRoundIndex++;

	if (tournament.currentRoundIndex >= tournament.rounds.length) {
		tournament.isComplete = true;
		return;
	}

	// Reset cards for next round (keep called state for songs already called, but clear bingo state)
	const eliminated = new Set(tournament.eliminatedCardIds);
	for (const card of sim.cards) {
		if (eliminated.has(card.id)) continue;
		card.hasBingo = false;
		card.winningLine = null;
		// Reset called state
		for (const cell of card.cells) {
			cell.called = cell.isFree;
		}
	}

	// Re-shuffle songs and reset call state
	const callOrder = shuffle(gameState.songs);
	sim.calledSongs = [];
	sim.remainingSongs = [...callOrder];
	sim.callOrder = callOrder;
	sim.winners = [];
	sim.isComplete = false;
	sim.currentCallIndex = 0;
}

export function autoPlayTournament(): void {
	const sim = gameState.simulation;
	if (!sim?.tournament) return;

	while (!sim.tournament.isComplete) {
		autoPlay();
		if (!sim.tournament.isComplete) {
			advanceToNextRound();
		}
	}
}

export function resetSimulation(): void {
	gameState.simulation = null;
	gameState.mode = 'generate';
}
