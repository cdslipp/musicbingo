<script lang="ts">
	import type { FontSizeCategory, Song } from '../types.js';
	import { stripFeaturing } from '../bingo/font-sizing.js';

	let {
		song = null,
		isFree = false,
		fontSize = 'medium' as FontSizeCategory,
		baseFontSize = 16,
		fontFamily = 'sans-serif',
		called = false,
		isWinningCell = false,
		onedit
	}: {
		song: Song | null;
		isFree: boolean;
		fontSize: FontSizeCategory;
		baseFontSize: number;
		fontFamily: string;
		called?: boolean;
		isWinningCell?: boolean;
		onedit?: (title: string, artist: string | undefined) => void;
	} = $props();

	const scaleMap: Record<FontSizeCategory, number> = {
		'xx-small': 0.55,
		'x-small': 0.7,
		small: 0.85,
		medium: 1,
		large: 1.15,
		'x-large': 1.3
	};

	const computedFontSize = $derived(`${baseFontSize * scaleMap[fontSize]}px`);
	const displayText = $derived(
		isFree
			? 'FREE'
			: song
				? song.artist
					? `${stripFeaturing(song.title)} by ${stripFeaturing(song.artist)}`
					: stripFeaturing(song.title)
				: ''
	);

	let editing = $state(false);
	let editValue = $state('');

	function startEdit() {
		if (!onedit || isFree || !song) return;
		editValue = displayText;
		editing = true;
	}

	function commitEdit() {
		editing = false;
		if (!onedit) return;
		const byIndex = editValue.lastIndexOf(' by ');
		if (byIndex !== -1) {
			onedit(editValue.slice(0, byIndex).trim(), editValue.slice(byIndex + 4).trim() || undefined);
		} else {
			onedit(editValue.trim(), undefined);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') commitEdit();
		if (e.key === 'Escape') editing = false;
	}
</script>

<div
	class="grid place-items-center overflow-hidden border border-gray-400 p-1
		{isFree ? 'font-bold' : ''}
		{called ? 'bg-green-200' : 'bg-white'}
		{isWinningCell ? 'bg-yellow-300 ring-2 ring-yellow-500' : ''}
		{onedit && !isFree ? 'cursor-pointer hover:bg-blue-50' : ''}"
	style="font-size: {computedFontSize}; font-family: {fontFamily}; aspect-ratio: 1;"
	onclick={startEdit}
	role={onedit && !isFree ? 'button' : undefined}
	tabindex={onedit && !isFree ? 0 : undefined}
	onkeydown={onedit && !isFree ? (e) => { if (e.key === 'Enter') startEdit(); } : undefined}
>
	{#if editing}
		<input
			class="w-full rounded border border-blue-400 px-1 text-center text-xs leading-tight"
			style="font-family: {fontFamily};"
			bind:value={editValue}
			onblur={commitEdit}
			onkeydown={handleKeydown}
			autofocus
		/>
	{:else}
		<span class="text-center leading-tight" style="overflow-wrap: anywhere;">{displayText}</span>
	{/if}
</div>
