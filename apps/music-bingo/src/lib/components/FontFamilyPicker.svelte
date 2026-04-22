<script lang="ts">
	import { googleFonts } from '../data/google-fonts.js';
	import { loadGoogleFont, isGoogleFont, preloadGoogleFonts } from '../fonts/font-loader.js';

	let {
		label,
		value,
		onchange
	}: {
		label: string;
		value: string;
		onchange: (family: string) => void;
	} = $props();

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

	let query = $state(value);
	let open = $state(false);
	let highlightIndex = $state(0);
	let loading = $state(false);
	let inputEl: HTMLInputElement | undefined = $state();
	let listEl: HTMLUListElement | undefined = $state();

	$effect(() => {
		preloadGoogleFonts(googleFonts.map((f) => f.family));
	});

	const filtered = $derived.by(() => {
		const q = query.toLowerCase().trim();
		if (!q) return [...BUILTIN_FONTS, ...googleFonts];
		return [
			...BUILTIN_FONTS.filter((f) => f.family.toLowerCase().includes(q)),
			...googleFonts.filter((f) => f.family.toLowerCase().includes(q))
		];
	});

	async function selectFont(family: string) {
		open = false;
		query = family;
		if (isGoogleFont(family)) {
			loading = true;
			await loadGoogleFont(family);
			loading = false;
		}
		onchange(family);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			highlightIndex = Math.min(highlightIndex + 1, filtered.length - 1);
			(listEl?.children[highlightIndex] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest' });
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlightIndex = Math.max(highlightIndex - 1, 0);
			(listEl?.children[highlightIndex] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest' });
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (filtered[highlightIndex]) { selectFont(filtered[highlightIndex].family); inputEl?.blur(); }
		} else if (e.key === 'Escape') {
			open = false;
			query = value;
			inputEl?.blur();
		}
	}
</script>

<div>
	<label class="mb-1 block text-sm font-medium text-gray-700">{label}</label>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="font-combobox relative" onkeydown={handleKeydown}>
		<input
			type="text"
			role="combobox"
			aria-expanded={open}
			aria-autocomplete="list"
			aria-controls="font-listbox-{label}"
			autocomplete="off"
			bind:this={inputEl}
			bind:value={query}
			oninput={() => { open = true; highlightIndex = 0; }}
			onfocus={() => { open = true; query = ''; }}
			onblur={(e) => {
				if ((e.relatedTarget as HTMLElement | null)?.closest('.font-combobox')) return;
				open = false;
				query = value;
			}}
			placeholder="Search fonts..."
			class="w-full rounded border border-gray-300 px-3 py-2 text-sm"
		/>
		{#if loading}
			<span class="absolute right-3 top-2.5 text-xs text-gray-400">Loading…</span>
		{/if}
		{#if open}
			<ul
				id="font-listbox-{label}"
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
