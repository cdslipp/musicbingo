import type { BingoCard, BingoCell, Song } from '../types.js';
import { shuffle } from './shuffle.js';
import { getFontSize } from './font-sizing.js';

export function generateCards(songs: Song[], count: number): BingoCard[] {
	if (songs.length < 24) {
		throw new Error(`Need at least 24 songs to generate a bingo card, got ${songs.length}`);
	}

	const cards: BingoCard[] = [];
	for (let i = 0; i < count; i++) {
		const shuffled = shuffle(songs);
		const selected = shuffled.slice(0, 24);

		const cells: BingoCell[] = [];
		for (let j = 0; j < 25; j++) {
			if (j === 12) {
				cells.push({ song: null, isFree: true, fontSize: 'x-large' });
			} else {
				const songIndex = j < 12 ? j : j - 1;
				const song = selected[songIndex];
				cells.push({ song, isFree: false, fontSize: getFontSize(song) });
			}
		}

		cards.push({ id: i, cells });
	}

	return cards;
}
