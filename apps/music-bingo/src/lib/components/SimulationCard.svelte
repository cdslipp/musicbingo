<script lang="ts">
	import type { SimulationCard } from '../types.js';
	import BingoCell from './BingoCell.svelte';

	let {
		card,
		baseFontSize = 16,
		fontFamily = 'sans-serif',
		compact = false,
		eliminated = false,
		eliminatedRound
	}: {
		card: SimulationCard;
		baseFontSize: number;
		fontFamily: string;
		compact?: boolean;
		eliminated?: boolean;
		eliminatedRound?: number;
	} = $props();

	const winningSet = $derived(new Set(card.winningLine ?? []));
</script>

<div
	class="rounded-lg border-2 p-1
		{eliminated
			? 'border-gray-300 bg-gray-100 opacity-50'
			: card.hasBingo
				? 'border-yellow-400 bg-yellow-50 shadow-lg shadow-yellow-200'
				: 'border-gray-200'}"
>
	<div class="mb-1 text-center text-xs font-medium text-gray-500">
		Card #{card.id + 1}
		{#if eliminated}
			<span class="ml-1 text-gray-400">Eliminated R{eliminatedRound}</span>
		{:else if card.hasBingo}
			<span class="ml-1 text-yellow-600">BINGO!</span>
		{/if}
	</div>
	<div class="grid grid-cols-5 gap-0">
		{#each card.cells as cell, i}
			<BingoCell
				song={cell.song}
				isFree={cell.isFree}
				fontSize={cell.fontSize}
				baseFontSize={compact ? Math.max(8, baseFontSize * 0.5) : baseFontSize}
				{fontFamily}
				called={cell.called}
				isWinningCell={winningSet.has(i)}
			/>
		{/each}
	</div>
</div>
