<script lang="ts">
	import type { TournamentState, WinCondition } from '../types.js';

	let { tournament }: { tournament: TournamentState } = $props();

	const conditionNames: Record<WinCondition, string> = {
		standard: 'Standard',
		row: 'Row',
		'four-corners': 'Four Corners',
		'full-card': 'Full Card'
	};
</script>

{#if tournament.roundResults.length > 0}
	<div class="rounded-lg border border-gray-200 bg-white p-4">
		<h3 class="mb-2 text-sm font-semibold text-gray-700">Results</h3>
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b text-left text-xs text-gray-500">
					<th class="pb-1 pr-2">Round</th>
					<th class="pb-1 pr-2">Condition</th>
					<th class="pb-1 pr-2">Winner(s)</th>
					<th class="pb-1">Calls</th>
				</tr>
			</thead>
			<tbody>
				{#each tournament.roundResults as result}
					<tr class="border-b border-gray-100">
						<td class="py-1 pr-2">{result.roundIndex + 1}</td>
						<td class="py-1 pr-2">{conditionNames[result.config.winCondition]}</td>
						<td class="py-1 pr-2">
							{#if result.winnerRecords.length === 0}
								<span class="text-gray-400">None</span>
							{:else}
								{@const ids = result.winnerRecords.map((w) => `#${w.cardId + 1}`)}
								{ids.join(', ')}
								{#if result.winnerRecords.length > 1}
									<span class="ml-1 rounded bg-yellow-100 px-1 text-xs font-medium text-yellow-700">TIE</span>
								{/if}
							{/if}
						</td>
						<td class="py-1">{result.totalCalls}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
