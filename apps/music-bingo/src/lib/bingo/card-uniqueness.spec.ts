import { describe, it, expect } from 'vitest';
import { checkCardUniqueness } from './card-uniqueness.js';
import type { BingoCard, BingoCell } from '../types.js';

function makeCard(id: number, titles: string[]): BingoCard {
	const cells: BingoCell[] = [];
	let songIdx = 0;
	for (let i = 0; i < 25; i++) {
		if (i === 12) {
			cells.push({ song: null, isFree: true, fontSize: 'x-large' });
		} else {
			cells.push({
				song: { title: titles[songIdx++] },
				isFree: false,
				fontSize: 'medium'
			});
		}
	}
	return { id, cells };
}

describe('checkCardUniqueness', () => {
	it('returns allUnique: true for 0 cards', () => {
		const result = checkCardUniqueness([]);
		expect(result.allUnique).toBe(true);
		expect(result.totalCards).toBe(0);
	});

	it('returns allUnique: true for 1 card', () => {
		const titles = Array.from({ length: 24 }, (_, i) => `Song ${i}`);
		const result = checkCardUniqueness([makeCard(0, titles)]);
		expect(result.allUnique).toBe(true);
		expect(result.uniqueCards).toBe(1);
	});

	it('returns allUnique: true when cards have different songs', () => {
		const titlesA = Array.from({ length: 24 }, (_, i) => `Song A${i}`);
		const titlesB = Array.from({ length: 24 }, (_, i) => `Song B${i}`);
		const result = checkCardUniqueness([makeCard(0, titlesA), makeCard(1, titlesB)]);
		expect(result.allUnique).toBe(true);
		expect(result.uniqueCards).toBe(2);
		expect(result.duplicateCards).toBe(0);
	});

	it('detects duplicates when cards have same songs in different order', () => {
		const titles = Array.from({ length: 24 }, (_, i) => `Song ${i}`);
		const reversed = [...titles].reverse();
		const result = checkCardUniqueness([makeCard(0, titles), makeCard(1, reversed)]);
		expect(result.allUnique).toBe(false);
		expect(result.uniqueCards).toBe(1);
		expect(result.duplicateCards).toBe(1);
		expect(result.uniquenessPercent).toBe(50);
	});

	it('counts multiple duplicates correctly', () => {
		const titles = Array.from({ length: 24 }, (_, i) => `Song ${i}`);
		const cards = [makeCard(0, titles), makeCard(1, titles), makeCard(2, titles)];
		const result = checkCardUniqueness(cards);
		expect(result.totalCards).toBe(3);
		expect(result.uniqueCards).toBe(1);
		expect(result.duplicateCards).toBe(2);
	});
});
