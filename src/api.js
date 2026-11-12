// url.search = new URLSearchParams({
//   client_id: clientId,
//   response_type: "code",
//   redirect_uri: "http://127.0.0.1:5173/",
//   scope: "playlist-modify-private",
//   code_challenge_method: "S256",
//   code_challenge: codeChallenge,
//   state,
// }).toString();

// window.location.assign(url.toString());
const clientId = "a5c9c887361547bf9544470d7dba6fec";
const redirectUri = "https://jammmming.netlify.app/";

function generateCodeVerifier() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function authorize() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateCodeVerifier();

  sessionStorage.setItem("spotify_code_verifier", codeVerifier);
  sessionStorage.setItem("spotify_state", state);

  const url = new URL("https://accounts.spotify.com/authorize");

  url.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: "playlist-modify-private",
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
  }).toString();

  window.location.assign(url.toString());
}

export function getAuthorizationCode() {
  const params = new URLSearchParams(window.location.search);

  const error = params.get("error");

  if (error) {
    throw new Error(`Spotify: ${error}`);
  }

  const code = params.get("code");

  if (!code) {
    return null;
  }

  const state = params.get("state");
  const savedState = sessionStorage.getItem("spotify_state");

  if (!savedState || state !== savedState) {
    throw new Error("Ответ Spotify не прошёл проверку state");
  }

  return code;
}

export async function exchangeCodeForToken() {
  const code = getAuthorizationCode();

  if (!code) return null;

  const codeVerifier = sessionStorage.getItem("spotify_code_verifier");

  if (!codeVerifier) {
    throw new Error("Не найден codeVerifier. Войди через Spotify заново.");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.error || "Ошибка авторизации");
  }

  sessionStorage.setItem("spotify_access_token", data.access_token);
  sessionStorage.setItem("spotify_expires_at", String(Date.now() + data.expires_in * 1000));

  sessionStorage.removeItem("spotify_code_verifier");
  sessionStorage.removeItem("spotify_state");

  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  window.history.replaceState({}, "", url);

  return data.access_token;
}

export function getAccessToken() {
  const token = sessionStorage.getItem("spotify_access_token");
  const expiresAt = Number(sessionStorage.getItem("spotify_expires_at"));

  if (!token || !expiresAt || Date.now() >= expiresAt) {
    sessionStorage.removeItem("spotify_access_token");
    sessionStorage.removeItem("spotify_expires_at");

    return null;
  }

  return token;
}

export async function searchTracks(search) {
  if (!search.trim()) return [];

  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Войди через Spotify перед поиском");
  }

  const params = new URLSearchParams({
    q: search,
    type: "track",
    limit: "10",
  });

  const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Ошибка поиска треков");
  }

  return data.tracks.items;
}
export async function savePlaylist(name, tracks) {
  if (!name.trim()) {
    throw new Error("Введи название плейлиста");
  }

  if (tracks.length === 0) {
    throw new Error("Добавь треки в плейлист");
  }

  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Войди через Spotify перед сохранением");
  }

  const trackUris = tracks.map((item) => item.uri);

  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.trim(),
      public: false,
    }),
  });

  const playlist = await response.json();

  if (!response.ok) {
    throw new Error(playlist.error?.message || "Не удалось создать плейлист");
  }

  const playlistId = playlist.id;

  const itemsResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: trackUris,
    }),
  });

  const itemsData = await itemsResponse.json();

  if (!itemsResponse.ok) {
    throw new Error(itemsData.error?.message || "Плейлист создан, но не удалось добавить треки");
  }

  return playlist;
}
