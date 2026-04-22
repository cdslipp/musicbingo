import type { FontSizeCategory, Song } from '../types.js';

// Remove parenthetical feat. credits like "(feat. Artist)" or "(ft. Artist)"
export function stripFeaturing(text: string): string {
	return text.replace(/\s*\((?:feat|ft)\.?[^)]*\)/gi, '').trim();
}

export function getDisplayText(song: Song): string {
	const title = stripFeaturing(song.title);
	if (song.artist) return `${title}\n${stripFeaturing(song.artist)}`;
	return title;
}

export function getFontSize(song: Song): FontSizeCategory {
	const text = getDisplayText(song);
	const maxWordLength = Math.max(...text.split(' ').map((w) => w.length));
	const totalLength = text.length;

	if (maxWordLength > 14 || totalLength > 60) return 'xx-small';
	if (maxWordLength > 10 || totalLength > 45) return 'x-small';
	if (maxWordLength > 8 || totalLength > 30) return 'small';
	if (maxWordLength > 7 || totalLength > 25) return 'medium';
	if (maxWordLength > 5 || totalLength > 20) return 'large';
	return 'x-large';
}
