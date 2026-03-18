/**
 * Parse a Spotify playlist ID from a URL or URI.
 *
 * Accepts:
 *   - https://open.spotify.com/playlist/{id}
 *   - https://open.spotify.com/playlist/{id}?si=...
 *   - spotify:playlist:{id}
 *
 * Returns null for anything else.
 */
export function parseSpotifyPlaylistId(input: string): string | null {
	const trimmed = input.trim();
	if (!trimmed) return null;

	// URI format: spotify:playlist:{id}
	const uriMatch = trimmed.match(/^spotify:playlist:([a-zA-Z0-9]+)$/);
	if (uriMatch) return uriMatch[1];

	// URL format: https://open.spotify.com/playlist/{id}...
	try {
		const url = new URL(trimmed);
		if (url.hostname !== 'open.spotify.com') return null;
		const match = url.pathname.match(/^\/playlist\/([a-zA-Z0-9]+)$/);
		return match ? match[1] : null;
	} catch {
		return null;
	}
}
