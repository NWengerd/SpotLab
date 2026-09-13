import {
    insertPlaylist,
    insertArtist,
    insertAlbum,
    insertTrack,
    insertTrackArtist,
    insertPlaylistTrack
} from "./databaseFunctions.js";
import { getPlaylists, getPlaylistTracks } from "./spotifyApi.js";


//Get list of all user's playlists, and insert all of them into the playlist table
export async function importPlaylists() {
    const data = await getPlaylists();

    for (const playlist of data) {
        insertPlaylist({
            id: playlist.id,
            name: playlist.name,
            description: playlist.description,
            owner_id: playlist.owner.id,
            uri: playlist.uri
        });
    }

    console.log(`Imported ${data.length} playlists.`);
}


export async function importPlaylistData(
    playlist
) {

    console.log(
        `Importing playlist: ${playlist.name}`
    );


    const items =
        await getPlaylistTracks(
            playlist.id
        );


    for (const item of items) {

        const track =
            item.item;


        // Spotify can occasionally return
        // null items for unavailable tracks.

        if (!track) {
            continue;
        }


        // ----------------------------------------------------
        // Album
        // ----------------------------------------------------

        if (track.album) {

            insertAlbum(
                track.album
            );
        }


        // ----------------------------------------------------
        // Artists
        // ----------------------------------------------------

        for (
            const artist
            of track.artists
        ) {

            insertArtist(
                artist
            );
        }


        // ----------------------------------------------------
        // Track
        // ----------------------------------------------------

        insertTrack(
            track
        );


        // ----------------------------------------------------
        // Track ↔ Artist relationships
        // ----------------------------------------------------

        for (
            const artist
            of track.artists
        ) {

            insertTrackArtist(
                track.id,
                artist.id
            );
        }


        // ----------------------------------------------------
        // Playlist ↔ Track relationship
        // ----------------------------------------------------

        insertPlaylistTrack(
            playlist.id,
            track.id
        );
    }


    console.log(
        `Finished: ${playlist.name}`
    );
}