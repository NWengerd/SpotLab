import { getValidAccessToken } from "./tokenManager.js";


const API_BASE =
    "https://api.spotify.com/v1";


export async function getCurrentUser() {

    const accessToken =
        localStorage.getItem("access_token");

    if (!accessToken) {

        throw new Error(
            "No Spotify access token found."
        );
    }

    const response = await fetch(
        `${API_BASE}/me`,
        {
            headers: {
                Authorization:
                    `Bearer ${accessToken}`
            }
        }
    );

    if (!response.ok) {

        throw new Error(
            `Spotify API request failed: ${response.status}`
        );
    }

    return await response.json();
}


// Fetch json from spotify API with valid access token
export async function spotifyFetch(endpoint) {

    const accessToken =
        await getValidAccessToken();


    const url =
        endpoint.startsWith("http")
            ? endpoint
            : `${API_BASE}${endpoint}`;


    const response =
        await fetch(
            url,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            `Spotify API error ${response.status}: ${errorText}`
        );
    }


    return await response.json();
}


// Fetch all playlists from current user's spotify, handling pagination
export async function getPlaylists() {

    const playlists = [];

    let url =
        "/me/playlists?limit=50";


    while (url) {

        const data =
            await spotifyFetch(url);

        playlists.push(
            ...data.items
        );

        url =
            data.next;
    }


    return playlists;
}

// Fetch all tracks from a given playlist, handling pagination
export async function getPlaylistTracks(playlistId) {

    const tracks = [];

    let url =
        `/playlists/${playlistId}/items?limit=50`;


    while (url) {

        const data =
            await spotifyFetch(url);

        tracks.push(
            ...data.items
        );

        url =
            data.next;
    }


    return tracks;
}

