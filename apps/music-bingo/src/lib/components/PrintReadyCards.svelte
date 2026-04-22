<script lang="ts">
	import type { BingoCard, PrintSize, FontSizeCategory } from '../types.js';
	import { stripFeaturing } from '../bingo/font-sizing.js';

	let {
		bingoTitle,
		cards,
		fontFamily = 'sans-serif',
		headerFontFamily = 'sans-serif',
		baseFontSize = 16,
		printSize = 'full'
	}: {
		bingoTitle: string;
		cards: BingoCard[];
		fontFamily: string;
		headerFontFamily: string;
		baseFontSize: number;
		printSize: PrintSize;
	} = $props();

	const scaleMap: Record<FontSizeCategory, number> = {
		'xx-small': 0.55,
		'x-small': 0.7,
		small: 0.85,
		medium: 1,
		large: 1.15,
		'x-large': 1.3
	};

	const isHalf = $derived(printSize === 'half');
	const cellSize = $derived(isHalf ? '0.95in' : '1.55in');
	const cardWidth = $derived(isHalf ? '5in' : '8in');
	const titleClass = $derived(isHalf ? 'mt-4 mb-3 text-2xl font-extrabold' : 'mt-6 mb-4 text-4xl font-extrabold');
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
						<h1 class={titleClass} style="font-family: {headerFontFamily};">{bingoTitle}</h1>
						<div class="grid grid-cols-5 grid-rows-5 gap-0">
							{#each card.cells as cell}
								<div
									class="grid place-items-center overflow-hidden border border-black p-1"
									style="height: {cellSize}; width: {cellSize}; font-size: {baseFontSize * scaleMap[cell.fontSize] * fontScale}px; font-family: {fontFamily};"
								>
									{#if cell.isFree}
										<span class="text-center font-bold leading-tight">FREE</span>
									{:else if cell.song}
										<span class="text-center leading-tight" style="overflow-wrap: anywhere;">
											{cell.song.artist ? `${stripFeaturing(cell.song.title)} by ${stripFeaturing(cell.song.artist)}` : stripFeaturing(cell.song.title)}
										</span>
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
			<h1 class={titleClass} style="font-family: {headerFontFamily};">{bingoTitle}</h1>
			<div class="grid grid-cols-5 grid-rows-5 gap-0">
				{#each card.cells as cell}
					<div
						class="grid place-items-center overflow-hidden border border-black p-1.5"
						style="height: {cellSize}; width: {cellSize}; font-size: {baseFontSize * scaleMap[cell.fontSize]}px; font-family: {fontFamily};"
					>
						{#if cell.isFree}
							<span class="text-center font-bold leading-tight">FREE</span>
						{:else if cell.song}
							<span class="text-center leading-tight" style="overflow-wrap: anywhere;">
								{cell.song.artist ? `${stripFeaturing(cell.song.title)} by ${stripFeaturing(cell.song.artist)}` : stripFeaturing(cell.song.title)}
							</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
{/if}
