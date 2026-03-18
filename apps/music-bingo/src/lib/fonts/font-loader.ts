const BUILTIN_FONTS = new Set(['Serif', 'Sans Serif', 'Monospace']);
const loadedFonts = new Set<string>();
let preloaded = false;

export function isGoogleFont(name: string): boolean {
	return !BUILTIN_FONTS.has(name);
}

export function preloadGoogleFonts(families: string[]): void {
	if (preloaded) return;
	preloaded = true;

	const params = families.map((f) => `family=${encodeURIComponent(f)}`).join('&');
	const link = document.createElement('link');
	link.id = 'gf-preload-all';
	link.rel = 'stylesheet';
	link.href = `https://fonts.googleapis.com/css2?${params}&display=swap`;
	document.head.appendChild(link);

	for (const f of families) {
		loadedFonts.add(f);
	}
}

export async function loadGoogleFont(family: string): Promise<boolean> {
	if (!isGoogleFont(family) || loadedFonts.has(family)) return true;

	const linkId = `gf-${family.replace(/\s+/g, '-').toLowerCase()}`;
	if (document.getElementById(linkId)) {
		loadedFonts.add(family);
		return true;
	}

	const link = document.createElement('link');
	link.id = linkId;
	link.rel = 'stylesheet';
	link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`;
	document.head.appendChild(link);

	try {
		await document.fonts.load(`16px "${family}"`);
		loadedFonts.add(family);
		return true;
	} catch {
		return false;
	}
}
