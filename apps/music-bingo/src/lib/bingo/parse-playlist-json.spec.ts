import { describe, it, expect } from 'vitest';
import { parsePlaylistJson } from './parse-playlist-json.js';

describe('parsePlaylistJson', () => {
	it('parses PlaylistData wrapper format', () => {
		const input = JSON.stringify({
			source: 'spotify',
			title: 'My Playlist',
			creator: 'DJ',
			tracks: [
				{ title: 'Song A', artist: 'Artist 1', album: 'Album X' },
				{ title: 'Song B', artist: 'Artist 2' }
			]
		});
		const result = parsePlaylistJson(input);
		expect(result.playlistTitle).toBe('My Playlist');
		expect(result.songs).toEqual([
			{ title: 'Song A', artist: 'Artist 1' },
			{ title: 'Song B', artist: 'Artist 2' }
		]);
	});

	it('parses bare array format', () => {
		const input = JSON.stringify([
			{ title: 'Track 1', artist: 'Band' },
			{ title: 'Track 2' }
		]);
		const result = parsePlaylistJson(input);
		expect(result.playlistTitle).toBeUndefined();
		expect(result.songs).toHaveLength(2);
		expect(result.songs[1].artist).toBeUndefined();
	});

	it('throws on invalid JSON', () => {
		expect(() => parsePlaylistJson('not json')).toThrow('Invalid JSON');
	});

	it('throws on empty input', () => {
		expect(() => parsePlaylistJson('')).toThrow('No JSON provided');
		expect(() => parsePlaylistJson('   ')).toThrow('No JSON provided');
	});

	it('throws when tracks is not an array', () => {
		expect(() => parsePlaylistJson('{"tracks": "nope"}')).toThrow(
			'Expected "tracks" to be an array'
		);
	});

	it('throws on wrong structure', () => {
		expect(() => parsePlaylistJson('{"foo": "bar"}')).toThrow(
			'Expected an array of tracks or an object with a "tracks" property'
		);
	});

	it('throws when no valid tracks found', () => {
		expect(() => parsePlaylistJson('[]')).toThrow('No valid tracks found');
		expect(() => parsePlaylistJson('{"tracks": [{}]}')).toThrow('No valid tracks found');
	});

	it('skips tracks without title', () => {
		const input = JSON.stringify({
			tracks: [{ artist: 'No Title' }, { title: 'Has Title', artist: 'A' }]
		});
		const result = parsePlaylistJson(input);
		expect(result.songs).toHaveLength(1);
		expect(result.songs[0].title).toBe('Has Title');
	});

	it('trims whitespace from values', () => {
		const input = JSON.stringify([{ title: '  Song  ', artist: '  Artist  ' }]);
		const result = parsePlaylistJson(input);
		expect(result.songs[0].title).toBe('Song');
		expect(result.songs[0].artist).toBe('Artist');
	});

	it('strips extra fields from tracks', () => {
		const input = JSON.stringify([{ title: 'X', artist: 'Y', album: 'Z', duration: 1000 }]);
		const result = parsePlaylistJson(input);
		expect(result.songs[0]).toEqual({ title: 'X', artist: 'Y' });
		expect('album' in result.songs[0]).toBe(false);
	});

	it('handles whitespace around JSON', () => {
		const input = `  \n  [{"title": "A", "artist": "B"}]  \n  `;
		const result = parsePlaylistJson(input);
		expect(result.songs).toHaveLength(1);
	});
});
