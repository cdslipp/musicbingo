<script lang="ts">
	import { parsePlaylistJson } from '$lib/bingo/parse-playlist-json.js';
	import { gameState, loadSongs } from '$lib/state/game-state.svelte.js';

	let jsonText = $state('');
	let errorMessage = $state('');
	let successMessage = $state('');

	function handleLoad() {
		errorMessage = '';
		successMessage = '';

		try {
			const { songs, playlistTitle } = parsePlaylistJson(jsonText);
			if (playlistTitle) {
				gameState.bingoTitle = playlistTitle;
			}
			loadSongs(songs);
			successMessage = `Loaded ${songs.length} songs`;
			jsonText = '';
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : 'Failed to parse JSON';
		}
	}
</script>

<div class="space-y-2">
	<label for="json-paste" class="mb-1 block text-sm font-medium text-gray-700">
		Paste Playlist JSON
	</label>
	<textarea
		id="json-paste"
		bind:value={jsonText}
		placeholder="Paste JSON from playlist exporter…"
		rows="3"
		class="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm"
	></textarea>
	<button
		onclick={handleLoad}
		disabled={!jsonText.trim()}
		class="w-full rounded bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
	>
		Load from JSON
	</button>
	{#if errorMessage}
		<p class="text-sm text-red-600">{errorMessage}</p>
	{/if}
	{#if successMessage}
		<p class="text-sm text-green-600">{successMessage}</p>
	{/if}
</div>
