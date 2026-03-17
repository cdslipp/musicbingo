<script lang="ts">
	import type { Song } from '../types.js';
	import { getDisplayText } from '../bingo/font-sizing.js';

	let {
		calledSongs
	}: {
		calledSongs: Song[];
	} = $props();
</script>

<div class="space-y-1">
	<h3 class="text-sm font-medium text-gray-700">Called Songs ({calledSongs.length})</h3>
	<div class="max-h-64 overflow-y-auto rounded border border-gray-200 bg-gray-50">
		{#if calledSongs.length === 0}
			<p class="p-2 text-xs text-gray-400 italic">No songs called yet</p>
		{:else}
			{#each calledSongs as song, i}
				<div class="border-b border-gray-100 px-2 py-1 text-xs {i === 0 ? 'bg-green-50 font-semibold' : ''}">
					<span class="text-gray-400">{calledSongs.length - i}.</span>
					{getDisplayText(song)}
				</div>
			{/each}
		{/if}
	</div>
</div>
