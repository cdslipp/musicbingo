import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import type { Song } from '$lib/types.js';
import { parseSpotifyPlaylistId } from '$lib/bingo/spotify.js';

interface SpotifyArtist {
	name: string;
}

interface SpotifyTrack {
	name: string;
	artists: SpotifyArtist[];
}

interface SpotifyTrackItem {
	track: SpotifyTrack | null;
}

interface SpotifyPlaylistResponse {
	items: SpotifyTrackItem[];
	next: string | null;
}

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`
		},
		body: 'grant_type=client_credentials'
	});

	if (!response.ok) {
		throw new Error('Failed to authenticate with Spotify');
	}

	const data = (await response.json()) as { access_token: string };
	return data.access_token;
}

export const GET: RequestHandler = async ({ url, platform }) => {
	const playlistUrl = url.searchParams.get('url');
	if (!playlistUrl) {
		error(400, 'Missing url parameter');
	}

	const playlistId = parseSpotifyPlaylistId(playlistUrl);
	if (!playlistId) {
		error(400, 'Invalid Spotify playlist URL');
	}

	const clientId = platform?.env?.SPOTIFY_CLIENT_ID;
	const clientSecret = platform?.env?.SPOTIFY_CLIENT_SECRET;
	if (!clientId || !clientSecret) {
		error(500, 'Spotify credentials not configured');
	}

	let accessToken: string;
	try {
		accessToken = await getAccessToken(clientId, clientSecret);
	} catch {
		error(500, 'Failed to authenticate with Spotify');
	}

	const songs: Song[] = [];
	let nextUrl: string | null =
		`https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(name,artists(name))),next&limit=100`;

	while (nextUrl) {
		const response = await fetch(nextUrl, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		if (response.status === 403) {
			error(403, 'Playlist is private or not accessible');
		}
		if (response.status === 404) {
			error(404, 'Playlist not found');
		}
		if (response.status === 429) {
			error(429, 'Spotify rate limit exceeded — try again in a moment');
		}
		if (!response.ok) {
			error(502, 'Failed to fetch playlist from Spotify');
		}

		const data = (await response.json()) as SpotifyPlaylistResponse;

		for (const item of data.items) {
			if (!item.track) continue; // skip local files
			songs.push({
				title: item.track.name,
				artist: item.track.artists.map((a) => a.name).join(', ') || undefined
			});
		}

		nextUrl = data.next;
	}

	return json(songs);
};
