<script lang="ts">
	import type { AppMode } from '../types.js';

	let {
		mode,
		onSwitch
	}: {
		mode: AppMode;
		onSwitch: (mode: AppMode) => void;
	} = $props();
</script>

<div class="flex rounded-lg bg-gray-100 p-1">
	<button
		onclick={() => onSwitch('generate')}
		class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors
			{mode === 'generate' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}"
	>
		Generate
	</button>
	<button
		onclick={() => onSwitch('simulate')}
		class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors
			{mode === 'simulate' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}"
	>
		Simulate
	</button>
</div>
