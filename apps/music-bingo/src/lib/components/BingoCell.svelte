<script lang="ts">
	import type { FontSizeCategory } from '../types.js';
	import { getDisplayText } from '../bingo/font-sizing.js';
	import type { Song } from '../types.js';

	let {
		song = null,
		isFree = false,
		fontSize = 'medium' as FontSizeCategory,
		baseFontSize = 16,
		fontFamily = 'sans-serif',
		called = false,
		isWinningCell = false
	}: {
		song: Song | null;
		isFree: boolean;
		fontSize: FontSizeCategory;
		baseFontSize: number;
		fontFamily: string;
		called?: boolean;
		isWinningCell?: boolean;
	} = $props();

	const scaleMap: Record<FontSizeCategory, number> = {
		small: 0.8,
		medium: 1,
		large: 1.2,
		'x-large': 1.4
	};

	function computedFontSize(): string {
		return `${baseFontSize * scaleMap[fontSize]}px`;
	}

	function displayText(): string {
		if (isFree) return 'FREE';
		if (!song) return '';
		return getDisplayText(song);
	}
</script>

<div
	class="flex items-center justify-center overflow-hidden border border-gray-400 p-1 text-center
		{isFree ? 'font-bold' : ''}
		{called ? 'bg-green-200' : 'bg-white'}
		{isWinningCell ? 'bg-yellow-300 ring-2 ring-yellow-500' : ''}"
	style="font-size: {computedFontSize()}; font-family: {fontFamily}; aspect-ratio: 1;"
>
	{displayText()}
</div>
