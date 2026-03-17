import { describe, it, expect } from 'vitest';
import { generateCards } from './generate-cards.js';
import type { Song } from '../types.js';

function makeSongs(n: number): Song[] {
	return Array.from({ length: n }, (_, i) => ({ title: `Song ${i + 1}` }));
}

describe('generateCards', () => {
	it('generates the requested number of cards', () => {
		const cards = generateCards(makeSongs(30), 5);
		expect(cards).toHaveLength(5);
	});

	it('each card has 25 cells', () => {
		const cards = generateCards(makeSongs(30), 3);
		for (const card of cards) {
			expect(card.cells).toHaveLength(25);
		}
	});

	it('index 12 is the FREE cell', () => {
		const cards = generateCards(makeSongs(30), 1);
		const free = cards[0].cells[12];
		expect(free.isFree).toBe(true);
		expect(free.song).toBeNull();
	});

	it('non-FREE cells have songs', () => {
		const cards = generateCards(makeSongs(30), 1);
		for (let i = 0; i < 25; i++) {
			if (i === 12) continue;
			expect(cards[0].cells[i].song).not.toBeNull();
			expect(cards[0].cells[i].isFree).toBe(false);
		}
	});

	it('no duplicate songs within a card', () => {
		const cards = generateCards(makeSongs(30), 1);
		const titles = cards[0].cells
			.filter((c) => !c.isFree)
			.map((c) => c.song!.title);
		expect(new Set(titles).size).toBe(24);
	});

	it('throws if fewer than 24 songs', () => {
		expect(() => generateCards(makeSongs(23), 1)).toThrow('Need at least 24 songs');
	});

	it('assigns unique ids to cards', () => {
		const cards = generateCards(makeSongs(30), 5);
		const ids = cards.map((c) => c.id);
		expect(new Set(ids).size).toBe(5);
	});
});
