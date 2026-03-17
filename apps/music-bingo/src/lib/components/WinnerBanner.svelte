<script lang="ts">
	import type { WinCondition, WinnerRecord } from '../types.js';

	let {
		winnerRecords,
		totalCalls,
		winCondition
	}: {
		winnerRecords: WinnerRecord[];
		totalCalls: number;
		winCondition: WinCondition;
	} = $props();

	const conditionNames: Record<WinCondition, string> = {
		standard: 'standard bingo',
		row: 'row bingo',
		'four-corners': 'four corners',
		'full-card': 'full card blackout'
	};

	// Group winners by callIndex to detect simultaneous wins
	const grouped = $derived.by(() => {
		const map = new Map<number, WinnerRecord[]>();
		for (const wr of winnerRecords) {
			const existing = map.get(wr.callIndex) ?? [];
			existing.push(wr);
			map.set(wr.callIndex, existing);
		}
		return map;
	});

	const hasTie = $derived(Array.from(grouped.values()).some((g) => g.length > 1));
</script>

{#if winnerRecords.length > 0}
	<div class="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4 text-center">
		<h2 class="text-2xl font-bold text-yellow-700">
			BINGO!
			{#if hasTie}
				<span class="ml-2 rounded bg-yellow-200 px-2 py-0.5 text-sm font-medium text-yellow-800">TIE</span>
			{/if}
		</h2>
		<p class="mt-1 text-sm text-yellow-600">
			{#if winnerRecords.length === 1}
				Card #{winnerRecords[0].cardId + 1} wins {conditionNames[winCondition]} after {totalCalls} songs!
			{:else}
				Cards {winnerRecords.map((w) => `#${w.cardId + 1}`).join(', ')} win {conditionNames[winCondition]} after {totalCalls} songs!
			{/if}
		</p>
	</div>
{/if}
