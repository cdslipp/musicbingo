import { describe, it, expect } from 'vitest';
import { shuffle } from './shuffle.js';

describe('shuffle', () => {
	it('returns a new array without mutating the original', () => {
		const original = [1, 2, 3, 4, 5];
		const copy = [...original];
		const result = shuffle(original);
		expect(original).toEqual(copy);
		expect(result).not.toBe(original);
	});

	it('returns an array of the same length', () => {
		const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		expect(shuffle(arr)).toHaveLength(arr.length);
	});

	it('contains all original elements', () => {
		const arr = [1, 2, 3, 4, 5];
		const result = shuffle(arr);
		expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
	});

	it('handles empty array', () => {
		expect(shuffle([])).toEqual([]);
	});

	it('handles single element', () => {
		expect(shuffle([42])).toEqual([42]);
	});
});
