import { describe, it, expect } from 'vitest';
import { parseSpotifyPlaylistId } from './spotify.js';

describe('parseSpotifyPlaylistId', () => {
	it('extracts ID from a standard playlist URL', () => {
		expect(
			parseSpotifyPlaylistId('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M')
		).toBe('37i9dQZF1DXcBWIGoYBM5M');
	});

	it('extracts ID from a URL with query params', () => {
		expect(
			parseSpotifyPlaylistId(
				'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=abc123&nd=1'
			)
		).toBe('37i9dQZF1DXcBWIGoYBM5M');
	});

	it('extracts ID from a Spotify URI', () => {
		expect(parseSpotifyPlaylistId('spotify:playlist:37i9dQZF1DXcBWIGoYBM5M')).toBe(
			'37i9dQZF1DXcBWIGoYBM5M'
		);
	});

	it('handles leading/trailing whitespace', () => {
		expect(
			parseSpotifyPlaylistId('  https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M  ')
		).toBe('37i9dQZF1DXcBWIGoYBM5M');
	});

	it('returns null for a track URL', () => {
		expect(
			parseSpotifyPlaylistId('https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6')
		).toBeNull();
	});

	it('returns null for an album URL', () => {
		expect(
			parseSpotifyPlaylistId('https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3')
		).toBeNull();
	});

	it('returns null for an empty string', () => {
		expect(parseSpotifyPlaylistId('')).toBeNull();
	});

	it('returns null for random text', () => {
		expect(parseSpotifyPlaylistId('not a url at all')).toBeNull();
	});

	it('returns null for a different domain', () => {
		expect(
			parseSpotifyPlaylistId('https://example.com/playlist/37i9dQZF1DXcBWIGoYBM5M')
		).toBeNull();
	});
});
