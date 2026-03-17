<script lang="ts">
	import {
		gameState,
		startSimulation,
		callNextSong,
		autoPlay,
		advanceToNextRound,
		autoPlayTournament,
		resetSimulation,
		getCurrentWinCondition
	} from '../state/game-state.svelte.js';
	import type { WinCondition } from '../types.js';
	import RoundBuilder from './RoundBuilder.svelte';

	const sim = $derived(gameState.simulation);
	const tournament = $derived(sim?.tournament ?? null);
	const currentWinCondition = $derived(getCurrentWinCondition());

	const winConditionLabels: Record<WinCondition, string> = {
		standard: 'Standard (row/col/diagonal)',
		row: 'Row only',
		'four-corners': 'Four corners',
		'full-card': 'Full card (blackout)'
	};

	const roundComplete = $derived(sim?.isComplete && tournament && !tournament.isComplete);
	const tournamentComplete = $derived(tournament?.isComplete ?? false);
</script>

<div class="space-y-3">
	{#if !sim}
		<div class="space-y-3">
			<p class="text-sm text-gray-600">Configure rounds and start a simulation</p>

			<RoundBuilder />

			<button
				onclick={() => startSimulation('random')}
				disabled={gameState.cards.length === 0}
				class="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
			>
				Random Order
			</button>
			<button
				onclick={() => startSimulation('csv')}
				disabled={gameState.cards.length === 0}
				class="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
			>
				CSV Order
			</button>
		</div>
	{:else}
		<div class="space-y-2">
			{#if tournament}
				<p class="text-sm font-medium text-gray-700">
					Round {tournament.currentRoundIndex + 1} of {tournament.rounds.length}: {winConditionLabels[currentWinCondition]}
				</p>
			{/if}
			<p class="text-sm text-gray-600">
				Called: {sim.currentCallIndex} / {sim.callOrder.length}
			</p>

			{#if !tournamentComplete}
				{#if roundComplete}
					<button
						onclick={advanceToNextRound}
						class="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						Play Next Round
					</button>
				{:else}
					<button
						onclick={callNextSong}
						disabled={sim.isComplete}
						class="w-full rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
					>
						Call Next Song
					</button>

					<button
						onclick={autoPlay}
						disabled={sim.isComplete}
						class="w-full rounded bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
					>
						Auto-Play Round
					</button>
				{/if}

				<button
					onclick={autoPlayTournament}
					disabled={tournamentComplete}
					class="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
				>
					Play All Rounds
				</button>
			{/if}

			<button
				onclick={resetSimulation}
				class="w-full rounded bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
			>
				Reset
			</button>
		</div>
	{/if}
</div>
