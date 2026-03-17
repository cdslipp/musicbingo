<script lang="ts">
	import { gameState, prevCard, nextCard } from '../state/game-state.svelte.js';
</script>

<div class="flex items-center gap-3">
	<button
		onclick={prevCard}
		disabled={gameState.currentCardIndex === 0}
		class="rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
	>
		Prev
	</button>
	<span class="text-sm text-gray-600">
		Card {gameState.currentCardIndex + 1} of {gameState.cards.length}
	</span>
	<button
		onclick={nextCard}
		disabled={gameState.currentCardIndex >= gameState.cards.length - 1}
		class="rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
	>
		Next
	</button>
</div>
