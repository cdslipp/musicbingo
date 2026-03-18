import type { Song } from '$lib/types.js';

interface ParseResult {
	songs: Song[];
	playlistTitle?: string;
}

export function parsePlaylistJson(jsonText: string): ParseResult {
	const trimmed = jsonText.trim();
	if (!trimmed) {
		throw new Error('No JSON provided');
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(trimmed);
	} catch {
		throw new Error('Invalid JSON');
	}

	let tracks: unknown[];
	let playlistTitle: string | undefined;

	if (Array.isArray(parsed)) {
		tracks = parsed;
	} else if (parsed && typeof parsed === 'object' && 'tracks' in parsed) {
		const obj = parsed as Record<string, unknown>;
		if (!Array.isArray(obj.tracks)) {
			throw new Error('Expected "tracks" to be an array');
		}
		tracks = obj.tracks;
		if (typeof obj.title === 'string' && obj.title.trim()) {
			playlistTitle = obj.title.trim();
		}
	} else {
		throw new Error('Expected an array of tracks or an object with a "tracks" property');
	}

	const songs: Song[] = [];
	for (const item of tracks) {
		if (!item || typeof item !== 'object') continue;
		const track = item as Record<string, unknown>;
		if (typeof track.title !== 'string' || !track.title.trim()) continue;
		songs.push({
			title: track.title.trim(),
			artist: typeof track.artist === 'string' ? track.artist.trim() : undefined
		});
	}

	if (songs.length === 0) {
		throw new Error('No valid tracks found');
	}

	return { songs, playlistTitle };
}
