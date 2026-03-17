import { describe, it, expect } from 'vitest';
import { getFontSize, getDisplayText } from './font-sizing.js';

describe('getDisplayText', () => {
	it('returns title only when no artist', () => {
		expect(getDisplayText({ title: 'Hello' })).toBe('Hello');
	});

	it('returns title - artist when artist present', () => {
		expect(getDisplayText({ title: 'Hello', artist: 'Adele' })).toBe('Hello - Adele');
	});
});

describe('getFontSize', () => {
	it('returns x-large for short songs', () => {
		expect(getFontSize({ title: 'Hello' })).toBe('x-large');
	});

	it('returns small for very long songs', () => {
		expect(getFontSize({ title: 'Supercalifragilisticexpialidocious Song Title' })).toBe('small');
	});

	it('returns medium for moderately long songs', () => {
		expect(getFontSize({ title: 'Something With A Medium Word' })).toBe('medium');
	});

	it('considers artist in display text length', () => {
		const short = getFontSize({ title: 'Hi' });
		const withArtist = getFontSize({ title: 'Hi', artist: 'A Very Long Artist Name Here' });
		expect(short).toBe('x-large');
		expect(withArtist).not.toBe('x-large');
	});
});
