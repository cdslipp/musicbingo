import type { FontSizeCategory, Song } from '../types.js';

const TITLE_MAX = 30;
const ARTIST_MAX = 25;

export function truncateTitle(title: string): string {
	if (title.length <= TITLE_MAX) return title;
	const keep = TITLE_MAX - 3;
	const front = Math.ceil(keep / 2);
	const back = Math.floor(keep / 2);
	return title.slice(0, front) + '...' + title.slice(-back);
}

export function truncateArtist(artist: string): string {
	const parts = artist.split(',').map((p) => p.trim());
	if (parts.length >= 3) {
		return parts[0] + '...';
	}
	if (parts.length === 2 && artist.length > ARTIST_MAX) {
		return parts[0] + '...';
	}
	if (artist.length > ARTIST_MAX) {
		return artist.slice(0, ARTIST_MAX - 3) + '...';
	}
	return artist;
}

export function getDisplayText(song: Song): string {
	if (song.artist) return `${truncateTitle(song.title)} - ${truncateArtist(song.artist)}`;
	return truncateTitle(song.title);
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
