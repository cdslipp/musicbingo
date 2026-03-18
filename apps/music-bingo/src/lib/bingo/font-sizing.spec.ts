import { describe, it, expect } from 'vitest';
import { getFontSize, getDisplayText, truncateTitle, truncateArtist } from './font-sizing.js';

describe('truncateTitle', () => {
	it('leaves short titles unchanged', () => {
		expect(truncateTitle('Bohemian Rhapsody')).toBe('Bohemian Rhapsody');
	});

	it('leaves titles at exactly 30 chars unchanged', () => {
		const title = 'A'.repeat(30);
		expect(truncateTitle(title)).toBe(title);
	});

	it('middle-truncates long titles', () => {
		const result = truncateTitle('this is a super long song tile about a song song');
		expect(result.length).toBe(30);
		expect(result).toContain('...');
		expect(result).toMatch(/^this is a supe/);
		expect(result).toMatch(/song song$/);
	});
});

describe('truncateArtist', () => {
	it('leaves short artist names unchanged', () => {
		expect(truncateArtist('Adele')).toBe('Adele');
	});

	it('truncates comma-separated list of 3+ to first entry', () => {
		expect(
			truncateArtist(
				'Tom Evans, Justas Kulikauskas, Johan Jens Erik Carlsson, Max Martin'
			)
		).toBe('Tom Evans...');
	});

	it('truncates 2-entry comma list only if over limit', () => {
		expect(truncateArtist('Tom Evans, Max Martin')).toBe('Tom Evans, Max Martin');
		expect(truncateArtist('Tom Evans, Justas Kulikauskas')).toBe('Tom Evans...');
	});

	it('end-truncates long non-comma artist names', () => {
		const result = truncateArtist('The Really Long Artist Name Here');
		expect(result.length).toBe(25);
		expect(result).toMatch(/\.\.\.$/);
	});
});

describe('getDisplayText', () => {
	it('returns title only when no artist', () => {
		expect(getDisplayText({ title: 'Hello' })).toBe('Hello');
	});

	it('returns title - artist when artist present', () => {
		expect(getDisplayText({ title: 'Hello', artist: 'Adele' })).toBe('Hello - Adele');
	});

	it('truncates both title and artist when long', () => {
		const result = getDisplayText({
			title: 'this is a super long song tile about a song song',
			artist: 'Tom Evans, Justas Kulikauskas, Johan Jens Erik Carlsson'
		});
		expect(result).toContain('...');
		expect(result).toContain(' - ');
		expect(result).toContain('Tom Evans...');
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
