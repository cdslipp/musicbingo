<script lang="ts">
	import type { UniquenessResult } from '../bingo/card-uniqueness.js';

	let { result }: { result: UniquenessResult | null } = $props();
</script>

{#if result}
	{#if result.allUnique}
		<p class="flex items-center gap-1 text-sm text-green-600">
			<span class="text-green-500">&#10003;</span>
			All {result.totalCards} cards unique
		</p>
	{:else}
		<p class="flex items-center gap-1 text-sm text-yellow-600">
			<span class="text-yellow-500">&#9888;</span>
			{result.duplicateCards} duplicate{result.duplicateCards > 1 ? 's' : ''} ({result.uniquenessPercent}% unique)
		</p>
	{/if}
{/if}
