<script lang="ts">
	import {
		gameState,
		addRound,
		removeRound,
		updateRound,
		moveRound
	} from '../state/game-state.svelte.js';
	import type { WinCondition } from '../types.js';

	const winConditionLabels: Record<WinCondition, string> = {
		standard: 'Standard (row/col/diagonal)',
		row: 'Row only',
		'four-corners': 'Four corners',
		'full-card': 'Full card (blackout)'
	};
</script>

<div class="space-y-2">
	<p class="text-sm font-medium text-gray-700">Rounds</p>
	{#each gameState.tournamentRounds as round, i}
		<div class="flex items-center gap-1">
			<span class="w-5 text-xs text-gray-400">{i + 1}.</span>
			<select
				value={round.winCondition}
				onchange={(e) => updateRound(i, (e.target as HTMLSelectElement).value as WinCondition)}
				class="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
			>
				{#each Object.entries(winConditionLabels) as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</select>
			<button
				onclick={() => moveRound(i, 'up')}
				disabled={i === 0}
				class="rounded px-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
				title="Move up"
			>&#9650;</button>
			<button
				onclick={() => moveRound(i, 'down')}
				disabled={i === gameState.tournamentRounds.length - 1}
				class="rounded px-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
				title="Move down"
			>&#9660;</button>
			<button
				onclick={() => removeRound(i)}
				disabled={gameState.tournamentRounds.length <= 1}
				class="rounded px-1 text-red-400 hover:text-red-600 disabled:opacity-30"
				title="Remove round"
			>&times;</button>
		</div>
	{/each}
	<button
		onclick={() => addRound('standard')}
		class="w-full rounded border border-dashed border-gray-300 px-3 py-1 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700"
	>
		+ Add Round
	</button>
</div>
