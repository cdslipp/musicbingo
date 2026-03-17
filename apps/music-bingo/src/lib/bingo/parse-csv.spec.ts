import { describe, it, expect } from 'vitest';
import { parseCsv } from './parse-csv.js';

describe('parseCsv', () => {
	it('parses single-column CSV (title only)', () => {
		const csv = 'Bohemian Rhapsody\nHotel California\nStairway to Heaven';
		const songs = parseCsv(csv);
		expect(songs).toHaveLength(3);
		expect(songs[0]).toEqual({ title: 'Bohemian Rhapsody', artist: undefined });
	});

	it('parses two-column CSV (title, artist)', () => {
		const csv = 'Bohemian Rhapsody,Queen\nHotel California,Eagles';
		const songs = parseCsv(csv);
		expect(songs).toHaveLength(2);
		expect(songs[0]).toEqual({ title: 'Bohemian Rhapsody', artist: 'Queen' });
		expect(songs[1]).toEqual({ title: 'Hotel California', artist: 'Eagles' });
	});

	it('trims whitespace', () => {
		const csv = '  Hello ,  World  ';
		const songs = parseCsv(csv);
		expect(songs[0]).toEqual({ title: 'Hello', artist: 'World' });
	});

	it('skips empty lines', () => {
		const csv = 'Song One\n\nSong Two\n\n';
		const songs = parseCsv(csv);
		expect(songs).toHaveLength(2);
	});

	it('skips rows with empty title', () => {
		const csv = ',Artist\nReal Song,Artist';
		const songs = parseCsv(csv);
		expect(songs).toHaveLength(1);
		expect(songs[0].title).toBe('Real Song');
	});
});
