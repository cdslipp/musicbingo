<script lang="ts">
	import { gameState, regenerateCards, updateSong } from '../state/game-state.svelte.js';
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-xl font-bold text-gray-900">Songs</h2>
			<p class="text-sm text-gray-600">
				{gameState.songs.length} loaded. Edits apply to existing cards immediately.
			</p>
		</div>
		<button
			onclick={regenerateCards}
			disabled={gameState.songs.length < 24}
			class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
		>
			Regenerate Cards
		</button>
	</div>

	{#if gameState.songs.length === 0}
		<div class="rounded border border-dashed border-gray-300 p-8 text-center text-gray-500">
			No songs loaded. Switch to Generate to upload a CSV or paste a playlist.
		</div>
	{:else}
		<div class="overflow-hidden rounded border border-gray-200">
			<table class="w-full text-sm">
				<thead class="sticky top-0 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
					<tr>
						<th class="w-12 px-3 py-2">#</th>
						<th class="px-3 py-2">Title</th>
						<th class="px-3 py-2">Artist</th>
					</tr>
				</thead>
				<tbody>
					{#each gameState.songs as song, i (i)}
						<tr class="border-t border-gray-200 hover:bg-gray-50">
							<td class="px-3 py-1.5 text-gray-400">{i + 1}</td>
							<td class="px-3 py-1.5">
								<input
									type="text"
									value={song.title}
									onchange={(e) =>
										updateSong(song, e.currentTarget.value, song.artist)}
									class="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
								/>
							</td>
							<td class="px-3 py-1.5">
								<input
									type="text"
									value={song.artist ?? ''}
									onchange={(e) =>
										updateSong(
											song,
											song.title,
											e.currentTarget.value.trim() || undefined
										)}
									class="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
								/>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
