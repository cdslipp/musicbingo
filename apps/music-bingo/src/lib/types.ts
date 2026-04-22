export interface Song {
	title: string;
	artist?: string;
}

export type FontSizeCategory = 'xx-small' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large';

export interface BingoCell {
	song: Song | null; // null for FREE
	isFree: boolean;
	fontSize: FontSizeCategory;
}

export interface BingoCard {
	id: number;
	cells: BingoCell[]; // length 25, index 12 = FREE
}

export interface SimulationCell extends BingoCell {
	called: boolean;
}

export interface SimulationCard {
	id: number;
	cells: SimulationCell[];
	hasBingo: boolean;
	winningLine: number[] | null;
}

export interface WinnerRecord {
	cardId: number;
	roundIndex: number;
	callIndex: number;
	winningLine: number[];
}

export interface RoundConfig {
	winCondition: WinCondition;
}

export interface RoundResult {
	roundIndex: number;
	config: RoundConfig;
	winnerRecords: WinnerRecord[];
	totalCalls: number;
	calledSongs: Song[];
}

export interface TournamentState {
	rounds: RoundConfig[];
	currentRoundIndex: number;
	roundResults: RoundResult[];
	eliminatedCardIds: number[];
	isComplete: boolean;
}

export interface GameSimulation {
	calledSongs: Song[];
	remainingSongs: Song[];
	callOrder: Song[];
	cards: SimulationCard[];
	winners: number[];
	winnerRecords: WinnerRecord[];
	isComplete: boolean;
	currentCallIndex: number;
	tournament: TournamentState | null;
}

export type WinCondition = 'standard' | 'row' | 'four-corners' | 'full-card';

export type AppMode = 'generate' | 'simulate' | 'table';

export type PrintSize = 'full' | 'half';
