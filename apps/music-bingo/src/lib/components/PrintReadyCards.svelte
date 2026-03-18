<script lang="ts">
	import type { BingoCard, PrintSize } from '../types.js';
	import { getDisplayText } from '../bingo/font-sizing.js';
	import type { FontSizeCategory } from '../types.js';

	let {
		bingoTitle,
		cards,
		fontFamily = 'sans-serif',
		baseFontSize = 16,
		printSize = 'full'
	}: {
		bingoTitle: string;
		cards: BingoCard[];
		fontFamily: string;
		baseFontSize: number;
		printSize: PrintSize;
	} = $props();

	const scaleMap: Record<FontSizeCategory, number> = {
		small: 0.8,
		medium: 1,
		large: 1.2,
		'x-large': 1.4
	};

	const isHalf = $derived(printSize === 'half');
	const cellSize = $derived(isHalf ? '0.95in' : '1.55in');
	const cardWidth = $derived(isHalf ? '5in' : '8in');
	const titleClass = $derived(isHalf ? 'mb-1 text-base font-bold' : 'mb-2 text-2xl font-bold');
	const fontScale = $derived(isHalf ? 0.65 : 1);

	// For half-size, pair cards two per page
	const pairedCards = $derived.by(() => {
		if (!isHalf) return null;
		const pairs: [BingoCard, BingoCard | null][] = [];
		for (let i = 0; i < cards.length; i += 2) {
			pairs.push([cards[i], cards[i + 1] ?? null]);
		}
		return pairs;
	});
</script>

{#if isHalf && pairedCards}
	{#each pairedCards as [cardA, cardB], pairIndex (pairIndex)}
		<div class="mx-auto flex h-[11in] w-[8.5in] flex-col items-center justify-evenly break-after-page">
			{#each [cardA, cardB] as card}
				{#if card}
					<div class="flex flex-col items-center" style="width: {cardWidth};">
						<h1 class={titleClass} style="font-family: {fontFamily};">{bingoTitle}</h1>
						<div class="grid grid-cols-5 grid-rows-5 gap-0">
							{#each card.cells as cell}
								<div
									class="flex items-center justify-center overflow-hidden border border-black p-1 text-center"
									style="height: {cellSize}; width: {cellSize}; font-size: {baseFontSize * scaleMap[cell.fontSize] * fontScale}px; font-family: {fontFamily};"
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
				{/if}
			{/each}
		</div>
	{/each}
{:else}
	{#each cards as card (card.id)}
		<div class="mx-auto flex flex-col items-center break-after-page pt-4" style="width: {cardWidth};">
			<h1 class={titleClass} style="font-family: {fontFamily};">{bingoTitle}</h1>
			<div class="grid grid-cols-5 grid-rows-5 gap-0">
				{#each card.cells as cell}
					<div
						class="flex items-center justify-center overflow-hidden border border-black p-1.5 text-center"
						style="height: {cellSize}; width: {cellSize}; font-size: {baseFontSize * scaleMap[cell.fontSize]}px; font-family: {fontFamily};"
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
{/if}
