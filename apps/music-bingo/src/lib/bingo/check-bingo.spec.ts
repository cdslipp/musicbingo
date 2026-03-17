import { describe, it, expect } from 'vitest';
import { checkBingo } from './check-bingo.js';

describe('checkBingo — standard', () => {
	it('returns null when no bingo', () => {
		expect(checkBingo(new Set([0, 1, 2, 3]))).toBeNull();
	});

	it('detects a full row (first row)', () => {
		const result = checkBingo(new Set([0, 1, 2, 3, 4]));
		expect(result).toEqual([0, 1, 2, 3, 4]);
	});

	it('detects middle row (FREE at index 12 counts)', () => {
		const result = checkBingo(new Set([10, 11, 13, 14]));
		expect(result).toEqual([10, 11, 12, 13, 14]);
	});

	it('detects a column', () => {
		const result = checkBingo(new Set([1, 6, 11, 16, 21]));
		expect(result).toEqual([1, 6, 11, 16, 21]);
	});

	it('detects diagonal (top-left to bottom-right)', () => {
		const result = checkBingo(new Set([0, 6, 18, 24]));
		expect(result).toEqual([0, 6, 12, 18, 24]);
	});

	it('detects diagonal (top-right to bottom-left)', () => {
		const result = checkBingo(new Set([4, 8, 16, 20]));
		expect(result).toEqual([4, 8, 12, 16, 20]);
	});

	it('detects middle column (FREE at 12)', () => {
		const result = checkBingo(new Set([2, 7, 17, 22]));
		expect(result).toEqual([2, 7, 12, 17, 22]);
	});
});

describe('checkBingo — row only', () => {
	it('detects a row', () => {
		const result = checkBingo(new Set([0, 1, 2, 3, 4]), 'row');
		expect(result).toEqual([0, 1, 2, 3, 4]);
	});

	it('does NOT detect a column', () => {
		const result = checkBingo(new Set([0, 5, 10, 15, 20]), 'row');
		expect(result).toBeNull();
	});

	it('does NOT detect a diagonal', () => {
		const result = checkBingo(new Set([0, 6, 18, 24]), 'row');
		expect(result).toBeNull();
	});
});

describe('checkBingo — four corners', () => {
	it('detects four corners', () => {
		const result = checkBingo(new Set([0, 4, 20, 24]), 'four-corners');
		expect(result).toEqual([0, 4, 20, 24]);
	});

	it('returns null if missing a corner', () => {
		expect(checkBingo(new Set([0, 4, 20]), 'four-corners')).toBeNull();
	});

	it('does NOT detect a row', () => {
		expect(checkBingo(new Set([0, 1, 2, 3, 4]), 'four-corners')).toBeNull();
	});
});

describe('checkBingo — full card', () => {
	it('detects full card', () => {
		const allCalled = new Set(Array.from({ length: 25 }, (_, i) => i));
		const result = checkBingo(allCalled, 'full-card');
		expect(result).toHaveLength(25);
	});

	it('returns null if one cell missing', () => {
		const almost = new Set(Array.from({ length: 25 }, (_, i) => i));
		almost.delete(7); // remove one non-free cell
		expect(checkBingo(almost, 'full-card')).toBeNull();
	});

	it('does NOT count a row as full card', () => {
		expect(checkBingo(new Set([0, 1, 2, 3, 4]), 'full-card')).toBeNull();
	});
});
