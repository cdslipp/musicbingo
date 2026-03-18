<script lang="ts">
	import {
		gameState,
		getFontFamily,
		getUniqueSongCount,
		regenerateCards,
		callNextSong,
		getCurrentWinCondition
	} from '$lib/state/game-state.svelte.js';
	import BingoCard from '$lib/components/BingoCard.svelte';
	import CardNavigator from '$lib/components/CardNavigator.svelte';
	import CardUniquenessStatus from '$lib/components/CardUniquenessStatus.svelte';
	import CsvUploader from '$lib/components/CsvUploader.svelte';
	import JsonPaster from '$lib/components/JsonPaster.svelte';
	import FontControls from '$lib/components/FontControls.svelte';
	import PrintReadyCards from '$lib/components/PrintReadyCards.svelte';
	import TabSwitcher from '$lib/components/TabSwitcher.svelte';
	import SimulationControls from '$lib/components/SimulationControls.svelte';
	import SimulationCard from '$lib/components/SimulationCard.svelte';
	import SongCallList from '$lib/components/SongCallList.svelte';
	import TournamentSummary from '$lib/components/TournamentSummary.svelte';
	import WinnerBanner from '$lib/components/WinnerBanner.svelte';
	import { PrintLayout, triggerPrint } from 'pretty-print-browser';
	import type { AppMode, PrintSize, SimulationCard as SimulationCardType } from '$lib/types.js';

	let expandedCardId: number | null = $state(null);

	function handleTabSwitch(mode: AppMode) {
		gameState.mode = mode;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (gameState.mode === 'generate') {
			if (e.key === 'ArrowLeft') {
				if (gameState.currentCardIndex > 0) gameState.currentCardIndex--;
			} else if (e.key === 'ArrowRight') {
				if (gameState.currentCardIndex < gameState.cards.length - 1) gameState.currentCardIndex++;
			}
		}
		if (gameState.mode === 'simulate' && e.key === ' ') {
			e.preventDefault();
			callNextSong();
		}
	}

	const fontFamily = $derived(getFontFamily());
	const songCount = $derived(getUniqueSongCount());
	const sim = $derived(gameState.simulation);
	const tournament = $derived(sim?.tournament ?? null);
	const eliminatedSet = $derived(new Set(tournament?.eliminatedCardIds ?? []));
	const currentWinCondition = $derived(getCurrentWinCondition());

	// Find which round a card was eliminated in
	function getEliminatedRound(cardId: number): number | undefined {
		if (!tournament) return undefined;
		for (const result of tournament.roundResults) {
			if (result.winnerRecords.some((w) => w.cardId === cardId)) {
				return result.roundIndex + 1;
			}
		}
		return undefined;
	}

	const sortedSimCards = $derived.by(() => {
		if (!sim) return [];
		const winners = sim.cards.filter(
			(c: SimulationCardType) => c.hasBingo && !eliminatedSet.has(c.id)
		);
		const active = sim.cards.filter(
			(c: SimulationCardType) => !c.hasBingo && !eliminatedSet.has(c.id)
		);
		const eliminated = sim.cards.filter((c: SimulationCardType) => eliminatedSet.has(c.id));
		return [...winners, ...active, ...eliminated];
	});

	// Current round's winner records (not from prior rounds)
	const currentRoundWinnerRecords = $derived.by(() => {
		if (!sim) return [];
		const roundIdx = tournament?.currentRoundIndex ?? 0;
		return sim.winnerRecords.filter((w) => w.roundIndex === roundIdx);
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<PrintLayout>
	{#snippet screen()}
		<div class="grid min-h-screen grid-cols-1 gap-6 p-6 md:grid-cols-[320px_1fr]">
			<!-- Sidebar -->
			<aside class="space-y-6">
				<h1 class="text-2xl font-bold text-gray-900">Music Bingo</h1>

				{#if gameState.cards.length > 0}
					<TabSwitcher mode={gameState.mode} onSwitch={handleTabSwitch} />
				{/if}

				{#if gameState.mode === 'generate'}
					<div>
						<label for="bingo-title" class="mb-1 block text-sm font-medium text-gray-700">Title</label>
						<input
							id="bingo-title"
							type="text"
							bind:value={gameState.bingoTitle}
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
						/>
					</div>

					<div>
						<label for="num-cards" class="mb-1 block text-sm font-medium text-gray-700">Number of Cards</label>
						<input
							id="num-cards"
							type="number"
							bind:value={gameState.numberOfCards}
							min="1"
							max="200"
							class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
						/>
						<button
							onclick={regenerateCards}
							disabled={gameState.songs.length < 24}
							class="mt-2 w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
						>
							Regenerate Cards
						</button>
					</div>

					<FontControls />
					<CsvUploader />
					<JsonPaster />

					{#if songCount > 0}
						<p class="text-sm text-gray-600">
							{songCount} songs loaded.
							{#if songCount < 24}
								<span class="text-red-500">Need at least 24 songs!</span>
							{/if}
						</p>
						<CardUniquenessStatus result={gameState.cardUniqueness} />
					{/if}

					{#if gameState.cards.length > 0}
						<div>
							<label class="mb-1 block text-sm font-medium text-gray-700">Print Size</label>
							<select
								bind:value={gameState.printSize}
								class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
							>
								<option value="full">Full Page (1 per page)</option>
								<option value="half">Half Page (2 per page)</option>
							</select>
						</div>
						<button
							onclick={triggerPrint}
							class="w-full rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
						>
							Print Cards
						</button>
					{/if}
				{:else}
					<SimulationControls />
					{#if sim}
						<SongCallList calledSongs={sim.calledSongs} />
					{/if}
				{/if}
			</aside>

			<!-- Main content -->
			<main>
				{#if gameState.mode === 'generate'}
					{#if gameState.cards.length === 0}
						<div class="flex h-full items-center justify-center text-gray-400">
							<p>Upload a CSV file to generate bingo cards</p>
						</div>
					{:else}
						<div class="space-y-4">
							<h2 class="text-xl font-bold" style="font-family: {fontFamily};">{gameState.bingoTitle}</h2>
							<div class="mx-auto max-w-xl">
								<BingoCard
									card={gameState.cards[gameState.currentCardIndex]}
									baseFontSize={gameState.baseFontSize}
									{fontFamily}
								/>
							</div>
							<div class="flex justify-center">
								<CardNavigator />
							</div>
						</div>
					{/if}
				{:else if sim}
					<div class="space-y-4">
						{#if tournament && tournament.roundResults.length > 0}
							<TournamentSummary {tournament} />
						{/if}

						{#if currentRoundWinnerRecords.length > 0}
							<WinnerBanner
								winnerRecords={currentRoundWinnerRecords}
								totalCalls={sim.currentCallIndex}
								winCondition={currentWinCondition}
							/>
						{/if}

						{#if expandedCardId !== null}
							{@const expandedCard = sim.cards.find((c: SimulationCardType) => c.id === expandedCardId)}
							{#if expandedCard}
								<div class="space-y-2">
									<button
										onclick={() => (expandedCardId = null)}
										class="text-sm text-blue-600 hover:underline"
									>
										&larr; Back to all cards
									</button>
									<div class="mx-auto max-w-xl">
										<SimulationCard
											card={expandedCard}
											baseFontSize={gameState.baseFontSize}
											fontFamily={getFontFamily()}
											eliminated={eliminatedSet.has(expandedCard.id)}
											eliminatedRound={getEliminatedRound(expandedCard.id)}
										/>
									</div>
								</div>
							{/if}
						{:else}
							<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
								{#each sortedSimCards as card (card.id)}
									<button
										onclick={() => (expandedCardId = card.id)}
										class="cursor-pointer text-left"
									>
										<SimulationCard
											{card}
											baseFontSize={gameState.baseFontSize}
											fontFamily={getFontFamily()}
											compact
											eliminated={eliminatedSet.has(card.id)}
											eliminatedRound={getEliminatedRound(card.id)}
										/>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</main>
		</div>
	{/snippet}

	{#snippet print()}
		<PrintReadyCards
			bingoTitle={gameState.bingoTitle}
			cards={gameState.cards}
			fontFamily={getFontFamily()}
			baseFontSize={gameState.baseFontSize}
			printSize={gameState.printSize}
		/>
	{/snippet}
</PrintLayout>
