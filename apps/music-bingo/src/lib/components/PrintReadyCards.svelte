<script lang="ts">
	import type { BingoCard } from '../types.js';
	import { getDisplayText } from '../bingo/font-sizing.js';
	import type { FontSizeCategory } from '../types.js';

	let {
		bingoTitle,
		cards,
		fontFamily = 'sans-serif',
		baseFontSize = 16
	}: {
		bingoTitle: string;
		cards: BingoCard[];
		fontFamily: string;
		baseFontSize: number;
	} = $props();

	const scaleMap: Record<FontSizeCategory, number> = {
		small: 0.8,
		medium: 1,
		large: 1.2,
		'x-large': 1.4
	};
</script>

{#each cards as card (card.id)}
	<div class="flex w-[8in] flex-col items-center break-after-page pt-4">
		<h1 class="mb-2 text-2xl font-bold" style="font-family: {fontFamily};">{bingoTitle}</h1>
		<div class="grid grid-cols-5 grid-rows-5 gap-0">
			{#each card.cells as cell, i}
				<div
					class="flex h-[1.55in] w-[1.55in] items-center justify-center overflow-hidden border border-black p-1.5 text-center"
					style="font-size: {baseFontSize * scaleMap[cell.fontSize]}px; font-family: {fontFamily};"
				>
					{#if cell.isFree}
						<span class="font-bold">FREE</span>
					{:else if cell.song}
						{getDisplayText(cell.song)}
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/each}
