# Apple Music Integration Research

Research for potentially adding Apple Music public playlist import to Music Bingo, focusing on minimal developer credentials.

## Apple Music API — Relevant Endpoints

### Reading Public Playlists
- **GET /v1/catalog/{storefront}/playlists/{id}** — Fetches a public playlist from the Apple Music Catalog.
- **Storefront Required:** You must know the storefront (e.g., `us`, `gb`) where the playlist is available.
- **Includes Tracks:** You can append `?include=tracks` to get the tracks in the same call.

## Authentication Requirements

### The Blocker: Paid Developer Account Required
To make **any** request to the Apple Music API, you must provide a Developer Token (JWT) in the `Authorization` header.

Generating this token requires:
1. A **MusicKit Private Key** (.p8 file)
2. A **MusicKit Identifier**
3. A **Team ID**

**All of these require an active, paid Apple Developer Program membership ($99/year).** There is no free tier, developer sandbox, or trial tier available for the Apple Music API. 

User authentication (Music User Token) is **not** required for public catalog playlists, but the app-level Developer Token is mandatory.

## Alternative Approaches
- **Unofficial Scraping:** Some projects attempt to scrape temporary tokens from the Apple Music web player. This violates Apple's Terms of Service, is highly unstable, and is strongly discouraged for production applications.

## Recommendation
**Do not proceed with Apple Music integration** unless there is a willingness to maintain a paid Apple Developer account ($99/year) indefinitely just for the API token. The requirement for a paid account violates the "minimal developer credentials" constraint.