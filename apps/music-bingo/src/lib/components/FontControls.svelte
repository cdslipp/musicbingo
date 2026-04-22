<script lang="ts">
	import { gameState, increaseFontSize, decreaseFontSize } from '../state/game-state.svelte.js';
	import FontFamilyPicker from './FontFamilyPicker.svelte';
</script>

<div class="space-y-3">
	<FontFamilyPicker
		label="Card Font"
		value={gameState.selectedFont}
		onchange={(f) => (gameState.selectedFont = f)}
	/>

	<FontFamilyPicker
		label="Header Font"
		value={gameState.selectedHeaderFont}
		onchange={(f) => (gameState.selectedHeaderFont = f)}
	/>

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
