<script lang="ts">
	import { gameState, increaseFontSize, decreaseFontSize } from '../state/game-state.svelte.js';
	import { googleFonts } from '../data/google-fonts.js';
	import { loadGoogleFont, isGoogleFont, preloadGoogleFonts } from '../fonts/font-loader.js';

	const BUILTIN_FONTS = [
		{ family: 'Serif', category: 'builtin' },
		{ family: 'Sans Serif', category: 'builtin' },
		{ family: 'Monospace', category: 'builtin' }
	];

	const CATEGORY_TO_GENERIC: Record<string, string> = {
		serif: 'serif',
		'sans-serif': 'sans-serif',
		display: 'sans-serif',
		handwriting: 'cursive',
		monospace: 'monospace'
	};

	function cssGeneric(category: string): string {
		return CATEGORY_TO_GENERIC[category] ?? 'sans-serif';
	}

	let query = $state(gameState.selectedFont);
	let open = $state(false);
	let highlightIndex = $state(0);
	let loading = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();
	let listEl: HTMLUListElement | undefined = $state();

	$effect(() => {
		preloadGoogleFonts(googleFonts.map((f) => f.family));
	});

	let filtered = $derived.by(() => {
		const q = query.toLowerCase().trim();
		if (!q) return [...BUILTIN_FONTS, ...googleFonts];

		const builtinMatches = BUILTIN_FONTS.filter((f) =>
			f.family.toLowerCase().includes(q)
		);
		const googleMatches = googleFonts
			.filter((f) => f.family.toLowerCase().includes(q));

		return [...builtinMatches, ...googleMatches];
	});

	async function selectFont(family: string) {
		open = false;
		query = family;

		if (isGoogleFont(family)) {
			loading = true;
			await loadGoogleFont(family);
			loading = false;
		}

		gameState.selectedFont = family;
	}

	function handleInput() {
		open = true;
		highlightIndex = 0;
	}

	function handleFocus() {
		open = true;
		query = '';
	}

	function handleBlur(e: FocusEvent) {
		const related = e.relatedTarget as HTMLElement | null;
		if (related?.closest('.font-combobox')) return;
		open = false;
		query = gameState.selectedFont;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			highlightIndex = Math.min(highlightIndex + 1, filtered.length - 1);
			scrollToHighlighted();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlightIndex = Math.max(highlightIndex - 1, 0);
			scrollToHighlighted();
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (filtered[highlightIndex]) {
				selectFont(filtered[highlightIndex].family);
				inputEl?.blur();
			}
		} else if (e.key === 'Escape') {
			open = false;
			query = gameState.selectedFont;
			inputEl?.blur();
		}
	}

	function scrollToHighlighted() {
		const item = listEl?.children[highlightIndex] as HTMLElement | undefined;
		item?.scrollIntoView({ block: 'nearest' });
	}
</script>

<div class="space-y-3">
	<div>
		<label for="font-search" class="mb-1 block text-sm font-medium text-gray-700">Font Family</label>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="font-combobox relative" onkeydown={handleKeydown}>
			<input
				id="font-search"
				type="text"
				role="combobox"
				aria-expanded={open}
				aria-autocomplete="list"
				aria-controls="font-listbox"
				autocomplete="off"
				bind:this={inputEl}
				bind:value={query}
				oninput={handleInput}
				onfocus={handleFocus}
				onblur={handleBlur}
				placeholder="Search fonts..."
				class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
			/>
			{#if loading}
				<span class="absolute right-3 top-2.5 text-xs text-gray-400">Loading…</span>
			{/if}
			{#if open}
				<ul
					id="font-listbox"
					role="listbox"
					bind:this={listEl}
					class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border border-gray-200 bg-white shadow-lg"
				>
					{#each filtered as font, i (font.family)}
						<li
							role="option"
							aria-selected={i === highlightIndex}
							class="cursor-pointer px-3 py-1.5 text-sm"
							class:bg-blue-100={i === highlightIndex}
							onmousedown={() => selectFont(font.family)}
							onmouseenter={() => (highlightIndex = i)}
						>
							{#if font.category === 'builtin'}
								<span class="font-medium">{font.family}</span>
								<span class="ml-1 text-xs text-gray-400">(built-in)</span>
							{:else}
								<span style="font-family: '{font.family}', {cssGeneric(font.category)}">{font.family}</span>
								<span class="ml-1 text-xs text-gray-400">{font.category}</span>
							{/if}
						</li>
					{/each}
					{#if filtered.length === 0}
						<li class="px-3 py-2 text-sm text-gray-400">No fonts found</li>
					{/if}
				</ul>
			{/if}
		</div>
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
