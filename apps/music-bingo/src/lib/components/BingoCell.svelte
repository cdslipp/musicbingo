<script lang="ts">
	import type { FontSizeCategory, Song } from '../types.js';
	import { stripFeaturing } from '../bingo/font-sizing.js';
	import SongEditModal from './SongEditModal.svelte';

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

	function startEdit() {
		if (!onedit || isFree || !song) return;
		editing = true;
	}

	function handleSave(title: string, artist: string | undefined) {
		editing = false;
		onedit?.(title, artist);
	}

	function handleCancel() {
		editing = false;
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
	<span class="text-center leading-tight" style="overflow-wrap: anywhere;">{displayText}</span>
</div>

<SongEditModal song={editing ? song : null} onSave={handleSave} onCancel={handleCancel} />
