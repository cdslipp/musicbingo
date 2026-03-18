# Tidal Integration Research

Research for potentially adding Tidal public playlist import to Music Bingo, focusing on minimal developer credentials.

## Tidal Developer Platform (Beta)

Tidal has recently opened a Developer Platform providing a JSON:API compliant RESTful API (v2).

### Relevant Endpoints
- **GET /playlists/{id}** — Retrieves metadata for a specific playlist.
- **GET /playlists/{id}/items** — Retrieves the list of tracks within the playlist.

## Authentication Options

### 1. Client Credentials (App-Level)
- For public data, standard OAuth 2.0 Client Credentials flow is sometimes sufficient.
- However, official documentation is heavily skewed towards user-delegated access (OAuth). Fetching a specific user's public playlist via client credentials alone can be inconsistent depending on the endpoint used.

### 2. User Authentication (OAuth)
- Requires the user to log in via Tidal.
- Requires specific scopes (e.g., `playlists.read`).
- This goes against the goal of a simple, no-login "paste a URL" import flow.

## Developer Credential Requirements
- **Cost:** Free. You can register an application on the [Tidal Developer Dashboard](https://developer.tidal.com) to get a Client ID and Client Secret.
- **Status:** The platform is currently in **Beta**. API endpoints, authentication flows, and rate limits are subject to change.

## Alternative Approaches
- **Unofficial Endpoints:** Some community projects use unofficial endpoints (e.g., the "Monochrome API" at `api.tidal.com/v1/`) which can fetch public playlist data without strict OAuth. However, these are unsupported and can break at any time.

## Recommendation
**Hold on Tidal integration for now.** While it doesn't require a paid developer account like Apple Music, the official API is still in Beta and its support for a seamless, server-to-server public playlist fetch (Client Credentials) without user login is not mature or clearly supported. If requested by users in the future, it can be revisited when the Developer Platform exits Beta.