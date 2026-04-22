<script lang="ts">
	import type { Song } from '../types.js';
	import { stripFeaturing } from '../bingo/font-sizing.js';

	let {
		song,
		onSave,
		onCancel
	}: {
		song: Song | null;
		onSave: (title: string, artist: string | undefined) => void;
		onCancel: () => void;
	} = $props();

	let dialogEl: HTMLDialogElement | undefined = $state();
	let editValue = $state('');

	function displayStringFor(s: Song): string {
		return s.artist
			? `${stripFeaturing(s.title)} by ${stripFeaturing(s.artist)}`
			: stripFeaturing(s.title);
	}

	$effect(() => {
		if (!dialogEl) return;
		if (song && !dialogEl.open) {
			editValue = displayStringFor(song);
			dialogEl.showModal();
		} else if (!song && dialogEl.open) {
			dialogEl.close();
		}
	});

	function save() {
		const byIndex = editValue.lastIndexOf(' by ');
		if (byIndex !== -1) {
			onSave(
				editValue.slice(0, byIndex).trim(),
				editValue.slice(byIndex + 4).trim() || undefined
			);
		} else {
			onSave(editValue.trim(), undefined);
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogEl) onCancel();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			save();
		}
	}
</script>

<dialog
	bind:this={dialogEl}
	oncancel={() => onCancel()}
	onclick={handleBackdropClick}
	onkeydown={handleKeydown}
	class="fixed inset-0 m-auto rounded-lg p-0 shadow-xl backdrop:bg-black/40"
>
	<div class="flex w-[min(32rem,90vw)] flex-col gap-4 p-6">
		<h3 class="text-lg font-semibold text-gray-900">Edit Song</h3>
		<textarea
			bind:value={editValue}
			rows="4"
			class="w-full resize-none rounded border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
		></textarea>
		<p class="text-xs text-gray-500">Format: <code>Title by Artist</code>. Press ⌘/Ctrl+Enter to save.</p>
		<div class="flex justify-end gap-2">
			<button
				type="button"
				onclick={() => onCancel()}
				class="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
			>
				Cancel
			</button>
			<button
				type="button"
				onclick={save}
				class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			>
				Save
			</button>
		</div>
	</div>
</dialog>
