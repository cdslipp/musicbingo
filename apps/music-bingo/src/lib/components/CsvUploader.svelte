<script lang="ts">
	import { loadCsv } from '../state/game-state.svelte.js';

	function handleFile(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				loadCsv(reader.result);
			}
		};
		reader.readAsText(file);
	}
</script>

<div>
	<label for="csv-upload" class="mb-1 block text-sm font-medium text-gray-700">Upload CSV</label>
	<input
		id="csv-upload"
		type="file"
		accept=".csv"
		onchange={handleFile}
		class="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
	/>
</div>
