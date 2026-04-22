<script lang="ts">
	import type { BingoCard, Song } from '../types.js';
	import BingoCell from './BingoCell.svelte';

	let {
		card,
		baseFontSize = 16,
		fontFamily = 'sans-serif',
		oneditcell
	}: {
		card: BingoCard;
		baseFontSize: number;
		fontFamily: string;
		oneditcell?: (song: Song, title: string, artist: string | undefined) => void;
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
			onedit={oneditcell && cell.song ? (title, artist) => oneditcell!(cell.song!, title, artist) : undefined}
		/>
	{/each}
</div>
