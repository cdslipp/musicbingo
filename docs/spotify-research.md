# Spotify Integration Research

Research for potentially adding Spotify playlist import to Music Bingo.

## Spotify Web API — Relevant Endpoints

### Reading Playlists

- **GET /v1/playlists/{playlist_id}** — playlist metadata (name, description, owner)
- **GET /v1/playlists/{playlist_id}/tracks** — paginated track list (100 per page)
  - Returns `items[].track.name` (title), `items[].track.artists[].name`, `items[].track.preview_url`, `items[].track.external_urls.spotify`
- Playlist must be **public** for Client Credentials flow; private playlists require user OAuth

### Extracting Song Data

From each track object we'd need:
- `track.name` → Song title
- `track.artists[0].name` → Primary artist
- `track.preview_url` → 30-second audio preview (see caveats below)
- `track.external_urls.spotify` → Link to full track on Spotify

## Authentication Options

### Option 1: Client Credentials (Server-Side)

- No user login required
- Only works with **public** playlists
- Server-to-server flow: exchange client_id + client_secret for access token
- Token valid for 1 hour, no refresh token
- Simplest to implement — good for MVP

### Option 2: Authorization Code with PKCE (Client-Side)

- Required for **private** playlists
- User grants permission via Spotify login popup
- More complex: redirect flow, token refresh, session management
- Needed if we want users to browse their own playlists

### Recommendation

Start with **Client Credentials** for public playlist import. Add PKCE later only if private playlist access is needed.

## Official TypeScript SDK

```
npm install @spotify/web-api-ts-sdk
```

- `@spotify/web-api-ts-sdk` — official, maintained by Spotify
- Supports both auth flows
- Typed responses for all endpoints
- Example:
  ```ts
  import { SpotifyApi } from '@spotify/web-api-ts-sdk';
  const api = SpotifyApi.withClientCredentials(clientId, clientSecret);
  const playlist = await api.playlists.getPlaylist('playlist_id');
  const tracks = playlist.tracks.items.map(item => ({
    title: item.track.name,
    artist: item.track.artists[0]?.name
  }));
  ```

## Dev Mode Restrictions (Feb 2026)

Spotify tightened developer access in early 2026:

- **Development Mode** (default for new apps):
  - Spotify Premium required for the app developer
  - Limited to **5 named users** (must be added by email in the dashboard)
  - Some endpoints restricted (primarily playback-related)
  - Playlist reading endpoints are still available
- **Extended Quota Mode**: requires application review by Spotify
  - Needed for production apps with >5 users
  - Review process takes days to weeks
  - Must demonstrate compliance with their usage policies

### Impact on Music Bingo

- For **local/personal use**: Dev Mode is fine. We only read playlists, no playback APIs needed.
- For **public deployment**: Would need Extended Quota approval. Alternative: have users paste a public playlist URL and fetch server-side with Client Credentials (no user login = no user limit applies, only the app's rate limits matter).

## preview_url Reliability

- `preview_url` is a 30-second MP3 preview link
- **Frequently null** — Spotify has been removing previews from many tracks
- No reliable pattern to predict availability (varies by region, label, licensing)
- As of early 2026, roughly 30-50% of tracks have null preview_url depending on the market
- **Not suitable as a primary audio playback strategy**

## Alternative Audio/Playback Approaches

### Spotify Embed (iframe)

```html
<iframe
  src="https://open.spotify.com/embed/track/{track_id}"
  width="300" height="80"
  allow="encrypted-media"
></iframe>
```

- No API key needed
- Plays 30-second preview for non-Premium users, full track for Premium
- Works reliably (Spotify controls availability)
- Downside: large, not customizable, requires network

### oEmbed API

```
GET https://open.spotify.com/oembed?url=https://open.spotify.com/track/{id}
```

- Returns embed HTML, thumbnail, title
- No auth needed
- Good for generating preview cards

### Web Playback SDK

- Full playback control in browser
- Requires Spotify Premium
- Requires OAuth (user must log in)
- Overkill for bingo — designed for building full music players

## Recommendation for Music Bingo

### Phase 1 (Playlist Import Only)

1. Accept a Spotify playlist URL from the user
2. Extract playlist ID from URL (`https://open.spotify.com/playlist/{id}`)
3. Server-side: use Client Credentials to fetch track list
4. Convert to our `Song[]` format (title + artist)
5. Feed into existing card generation pipeline
6. No audio needed — this replaces CSV upload with a URL input

### Phase 2 (Audio During Simulation — Optional)

1. During play-through simulation, show Spotify embed iframe for the currently called song
2. Embed auto-plays the preview
3. No API key needed for embeds, no auth needed
4. Fallback: just show song title + artist if embed fails to load

### What NOT to Build

- Don't build custom audio playback with preview_url (too unreliable)
- Don't use Web Playback SDK (requires Premium, complex auth, overkill)
- Don't try to cache or download audio (violates Spotify ToS)
