<script lang="ts">
	import { parseSpotifyPlaylistId } from '$lib/bingo/spotify.js';
	import { loadSongs } from '$lib/state/game-state.svelte.js';
	import type { Song } from '$lib/types.js';

	let url = $state('');
	let loading = $state(false);
	let errorMessage = $state('');

	const playlistId = $derived(parseSpotifyPlaylistId(url));
	const isValid = $derived(playlistId !== null);

	async function handleImport() {
		if (!isValid || loading) return;

		loading = true;
		errorMessage = '';

		try {
			const response = await fetch(`/api/spotify-playlist?url=${encodeURIComponent(url)}`);

			if (!response.ok) {
				const data = await response.json() as { message?: string };
				throw new Error(data.message || `Error ${response.status}`);
			}

			const songs = (await response.json()) as Song[];
			loadSongs(songs);
			url = '';
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : 'Failed to import playlist';
		} finally {
			loading = false;
		}
	}
</script>

<div class="space-y-2">
	<label for="spotify-url" class="mb-1 block text-sm font-medium text-gray-700">
		Import from Spotify
	</label>
	<input
		id="spotify-url"
		type="text"
		bind:value={url}
		placeholder="Paste Spotify playlist URL…"
		class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
		disabled={loading}
	/>
	<button
		onclick={handleImport}
		disabled={!isValid || loading}
		class="w-full rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
	>
		{#if loading}
			Importing…
		{:else}
			Import Playlist
		{/if}
	</button>
	{#if errorMessage}
		<p class="text-sm text-red-600">{errorMessage}</p>
	{/if}
</div>
