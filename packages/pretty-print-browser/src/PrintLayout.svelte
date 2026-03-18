<!--
	Wraps screen and print content. Hides screen content when printing
	and shows print content only when printing.

	Usage:
		<PrintLayout>
			{#snippet screen()}
				<p>Visible on screen</p>
			{/snippet}
			{#snippet print()}
				<p>Visible when printing</p>
			{/snippet}
		</PrintLayout>
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		screen,
		print
	}: {
		screen: Snippet;
		print: Snippet;
	} = $props();
</script>

<div class="pretty-print-screen">
	{@render screen()}
</div>
<div class="pretty-print-print">
	{@render print()}
</div>

<style>
	.pretty-print-print {
		display: none;
	}

	@media print {
		.pretty-print-screen {
			display: none;
		}
		.pretty-print-print {
			display: block;
		}
	}
</style>
