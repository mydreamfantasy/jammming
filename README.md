# Jammming

Jammming is a React app for building Spotify playlists. Search for tracks, arrange them in the order you want, and save the result as a private playlist in your Spotify account.

## Features

- Connect your Spotify account with OAuth 2.0 Authorization Code with PKCE.
- Search Spotify by track, artist, or album name and browse matching tracks.
- Add and remove tracks. Adding the same track twice keeps a single copy.
- Reorder selected tracks by dragging them within the playlist.
- Name your playlist and save it to Spotify in the order shown in Jammming.

## Run locally

Use Node.js 24 (developed with 24.22.2) and npm. Run these commands from the project root:

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/). The host and port are fixed so the local address matches the Spotify redirect URI.

## Configure Spotify

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and select **Web API**.
2. Register `http://127.0.0.1:5173/` as a redirect URI, including the trailing slash.
3. Copy your **Client ID** into the Spotify configuration in `src/api.js`. Keep its redirect URI identical to the one in the Dashboard. PKCE uses the Client ID and does not require a Client Secret in the frontend.
4. Open Jammming and click **Connect Spotify**. Approve the requested access to create and modify private playlists.

For Spotify apps in Development Mode, the app owner needs Spotify Premium and any additional test accounts must be added to the app's allowlist. See [Spotify quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes) and [redirect URI requirements](https://developer.spotify.com/documentation/web-api/concepts/redirect_uri).

## Use Jammming

After connecting Spotify, enter a query and click **Search** or press Enter. Click **+** to add a track to the draft playlist and **−** to remove it. Drag tracks into the order you want, enter a playlist name, and click **Add to Spotify**.

Jammming creates a private playlist and then sends the selected track URIs in the current order.

## Development

| Command | Purpose |
| --- | --- |
| `npm test` | Run the Vitest suite once |
| `npm run lint` | Check the source with ESLint |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |

The component tests use React Testing Library and jsdom to cover search submission and playlist interactions. Tests that exercise the save button can mock the Spotify API module instead of creating real playlists.

**Stack:** React, Vite, Spotify Web API, dnd-kit, Vitest, and React Testing Library.
