import type { FontSizeCategory, Song } from '../types.js';

export function getDisplayText(song: Song): string {
	if (song.artist) return `${song.title} - ${song.artist}`;
	return song.title;
}

export function getFontSize(song: Song): FontSizeCategory {
	const text = getDisplayText(song);
	const maxWordLength = Math.max(...text.split(' ').map((w) => w.length));
	const totalLength = text.length;

	if (maxWordLength > 10 || totalLength > 30) return 'small';
	if (maxWordLength > 7 || totalLength > 25) return 'medium';
	if (maxWordLength > 5 || totalLength > 20) return 'large';
	return 'x-large';
}
