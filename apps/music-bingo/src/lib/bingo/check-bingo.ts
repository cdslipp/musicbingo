import type { WinCondition } from '../types.js';

const ROWS: number[][] = [
	[0, 1, 2, 3, 4],
	[5, 6, 7, 8, 9],
	[10, 11, 12, 13, 14],
	[15, 16, 17, 18, 19],
	[20, 21, 22, 23, 24]
];

const COLUMNS: number[][] = [
	[0, 5, 10, 15, 20],
	[1, 6, 11, 16, 21],
	[2, 7, 12, 17, 22],
	[3, 8, 13, 18, 23],
	[4, 9, 14, 19, 24]
];

const DIAGONALS: number[][] = [
	[0, 6, 12, 18, 24],
	[4, 8, 12, 16, 20]
];

const FOUR_CORNERS: number[][] = [[0, 4, 20, 24]];

const ALL_CELLS: number[][] = [Array.from({ length: 25 }, (_, i) => i)];

function getLines(condition: WinCondition): number[][] {
	switch (condition) {
		case 'row':
			return ROWS;
		case 'four-corners':
			return FOUR_CORNERS;
		case 'full-card':
			return ALL_CELLS;
		case 'standard':
		default:
			return [...ROWS, ...COLUMNS, ...DIAGONALS];
	}
}

/**
 * Check if a set of called indices (plus FREE at 12) forms a bingo.
 * Returns the first winning line found, or null.
 */
export function checkBingo(
	calledIndices: Set<number>,
	condition: WinCondition = 'standard'
): number[] | null {
	const withFree = new Set(calledIndices);
	withFree.add(12);

	for (const line of getLines(condition)) {
		if (line.every((i) => withFree.has(i))) {
			return line;
		}
	}
	return null;
}
