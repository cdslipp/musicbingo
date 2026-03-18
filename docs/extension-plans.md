# Chrome Extension Integration Plan (Zero-Credential Strategy)

This plan outlines a strategy to import playlists from Apple Music and Spotify without requiring official developer API credentials or paid memberships. By using a Chrome extension, we can intercept the internal API traffic already happening in the user's browser.

## The Strategy: Network Interception

Instead of calling public APIs from our server, we build a Chrome extension (using the [WXT framework](https://wxt.dev/)) that:
1.  Runs on `music.apple.com` and `open.spotify.com`.
2.  Uses the `chrome.declarativeNetRequest` or `webRequest` API (or simply intercepts `fetch`/`XHR` in a content script) to listen for playlist-loading events.
3.  Extracts the raw JSON response containing the full tracklist.
4.  Sends the structured data to the Music Bingo application.

### Advantages
- **Zero Cost:** No $99/year Apple Developer fee.
- **No Limits:** Bypasses Spotify's "Development Mode" 5-user limit.
- **Private Access:** Works for private playlists because it leverages the user's active browser session.
- **Full Data:** Internal APIs often return more detail (like lyrics availability or specific classical metadata) than public-facing APIs.

---

## Apple Music Implementation

### 1. Intercept Target
We watch for GET requests to the Apple Music internal API (`amp-api.music.apple.com`).

**Pattern:** `https://amp-api.music.apple.com/v1/me/library/playlists/{id}?include=catalog,artists,tracks...`

### 2. Data Extraction Structure
The response is a JSON object with a highly useful `resources` dictionary. We can extract the tracklist by iterating through `resources["library-songs"]` or `resources["songs"]`.

**Key Mapping:**
- **Song Title:** `attributes.name`
- **Artist:** `attributes.artistName`
- **Album:** `attributes.albumName`
- **Duration:** `attributes.durationInMillis` (useful for bingo timing)
- **Artwork:** `attributes.artwork.url`

### 3. Example Extraction Logic (Pseudocode)
```javascript
const playlistData = response.resources["library-songs"];
const songs = Object.values(playlistData).map(track => ({
  title: track.attributes.name,
  artist: track.attributes.artistName,
  album: track.attributes.albumName,
  duration_ms: track.attributes.durationInMillis,
  image: track.attributes.artwork.url.replace('{w}x{h}', '300x300')
}));
```

---

## Spotify Implementation

### 1. Intercept Target
We watch for POST requests to the Spotify Partner API.

**URL:** `https://api-partner.spotify.com/pathfinder/v2/query`

**Request Filter:** The extension should filter for requests where:
- `operationName === "fetchPlaylist"`
- `variables.uri` matches a playlist (e.g., `spotify:playlist:4Jv78A0QB...`)

### 2. Data Extraction Structure
The response follows a GraphQL-style structure. We iterate through the items in the `content` block.

**Path:** `data.playlistV2.content.items`

**Key Mapping:**
- **Song Title:** `itemV2.data.name`
- **Artist:** `itemV2.data.artists.items.map(a => a.profile.name).join(', ')`
- **Album:** `itemV2.data.albumOfTrack.name`
- **Duration:** `itemV2.data.trackDuration.totalMilliseconds`
- **Artwork:** `itemV2.data.albumOfTrack.coverArt.sources[0].url` (usually 300x300 or 640x640)
- **Spotify URI:** `itemV2.data.uri`

### 3. Example Extraction Logic (Pseudocode)
```javascript
const items = response.data.playlistV2.content.items;
const songs = items.map(node => {
  const track = node.itemV2.data;
  return {
    title: track.name,
    artist: track.artists.items.map(a => a.profile.name).join(', '),
    album: track.albumOfTrack.name,
    duration_ms: track.trackDuration.totalMilliseconds,
    image: track.albumOfTrack.coverArt.sources[0]?.url,
    uri: track.uri
  };
});
```

---

## Extension Workflow
1.  **Detection:** User navigates to a playlist page.
2.  **Capture:** Extension detects the API response containing the tracklist.
3.  **UI Overlay:** A small "Import to Music Bingo" button appears on the page.
4.  **Transfer:** On click, the extension sends the JSON payload to the local Music Bingo app (via `postMessage` if the app is open in another tab, or via a simple POST to a local/hosted endpoint).
