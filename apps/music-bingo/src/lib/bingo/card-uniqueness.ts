import type { BingoCard } from '../types.js';

export interface UniquenessResult {
	totalCards: number;
	uniqueCards: number;
	duplicateCards: number;
	uniquenessPercent: number;
	allUnique: boolean;
}

function hashCard(card: BingoCard): string {
	const titles = card.cells
		.filter((c) => !c.isFree && c.song)
		.map((c) => c.song!.title)
		.sort();
	return titles.join('|');
}

export function checkCardUniqueness(cards: BingoCard[]): UniquenessResult {
	if (cards.length === 0) {
		return {
			totalCards: 0,
			uniqueCards: 0,
			duplicateCards: 0,
			uniquenessPercent: 100,
			allUnique: true
		};
	}

	const hashes = new Set<string>();
	for (const card of cards) {
		hashes.add(hashCard(card));
	}

	const uniqueCards = hashes.size;
	const duplicateCards = cards.length - uniqueCards;

	return {
		totalCards: cards.length,
		uniqueCards,
		duplicateCards,
		uniquenessPercent: Math.round((uniqueCards / cards.length) * 100),
		allUnique: duplicateCards === 0
	};
}
