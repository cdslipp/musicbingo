<script lang="ts">
	import type { BingoCard } from '../types.js';
	import BingoCell from './BingoCell.svelte';

	let {
		card,
		baseFontSize = 16,
		fontFamily = 'sans-serif'
	}: {
		card: BingoCard;
		baseFontSize: number;
		fontFamily: string;
	} = $props();
</script>

<div class="grid grid-cols-5 gap-0">
	{#each card.cells as cell}
		<BingoCell
			song={cell.song}
			isFree={cell.isFree}
			fontSize={cell.fontSize}
			{baseFontSize}
			{fontFamily}
		/>
	{/each}
</div>
