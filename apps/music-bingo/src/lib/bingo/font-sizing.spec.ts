import { describe, it, expect } from 'vitest';
import { getFontSize, getDisplayText } from './font-sizing.js';

describe('getDisplayText', () => {
	it('returns title only when no artist', () => {
		expect(getDisplayText({ title: 'Hello' })).toBe('Hello');
	});

	it('returns title newline artist when artist present', () => {
		expect(getDisplayText({ title: 'Hello', artist: 'Adele' })).toBe('Hello\nAdele');
	});

	it('does not truncate long titles or artists', () => {
		const result = getDisplayText({
			title: 'this is a super long song tile about a song song',
			artist: 'Tom Evans, Justas Kulikauskas, Johan Jens Erik Carlsson'
		});
		expect(result).not.toContain('...');
		expect(result).toContain('this is a super long song tile about a song song');
		expect(result).toContain('Tom Evans, Justas Kulikauskas, Johan Jens Erik Carlsson');
	});
});

describe('getFontSize', () => {
	it('returns x-large for short songs', () => {
		expect(getFontSize({ title: 'Hello' })).toBe('x-large');
	});

	it('returns a small size for very long songs', () => {
		const size = getFontSize({ title: 'Supercalifragilisticexpialidocious Song Title Here Now' });
		expect(['xx-small', 'x-small', 'small']).toContain(size);
	});

	it('returns medium for moderately long songs', () => {
		expect(getFontSize({ title: 'Happy Birthday' })).toBe('medium');
	});

	it('considers artist in display text length', () => {
		const short = getFontSize({ title: 'Hi' });
		const withArtist = getFontSize({ title: 'Hi', artist: 'A Very Long Artist Name Here' });
		expect(short).toBe('x-large');
		expect(withArtist).not.toBe('x-large');
	});
});
