<script lang="ts">
	import { gameState, increaseFontSize, decreaseFontSize } from '../state/game-state.svelte.js';
</script>

<div class="space-y-3">
	<div>
		<label for="font-select" class="mb-1 block text-sm font-medium text-gray-700">Font Family</label>
		<select
			id="font-select"
			bind:value={gameState.selectedFont}
			class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
		>
			<option value="Serif">Serif</option>
			<option value="Sans Serif">Sans Serif</option>
			<option value="Monospace">Monospace</option>
		</select>
	</div>

	<div>
		<span class="mb-1 block text-sm font-medium text-gray-700">Font Size</span>
		<div class="flex items-center gap-3">
			<button
				onclick={decreaseFontSize}
				class="rounded bg-gray-200 px-3 py-1 text-lg font-bold hover:bg-gray-300"
			>
				-
			</button>
			<span class="text-sm">{gameState.baseFontSize}px</span>
			<button
				onclick={increaseFontSize}
				class="rounded bg-gray-200 px-3 py-1 text-lg font-bold hover:bg-gray-300"
			>
				+
			</button>
		</div>
	</div>
</div>
