import db from "./database.js";


// ============================================================
// Artists
// ============================================================

export function insertArtist(artist) {

    const stmt = db.prepare(`
        INSERT INTO artists (
            artist_id,
            name
        )
        VALUES (?, ?)
        ON CONFLICT(artist_id) DO UPDATE SET
            name = excluded.name
    `);

    stmt.run(
        artist.id,
        artist.name
    );
}


// ============================================================
// Albums
// ============================================================

export function insertAlbum(album) {
    const statement = db.prepare(`
        INSERT INTO albums (
            album_id,
            name,
            album_type,
            release_date,
            total_tracks,
            spotify_uri
        )
        VALUES (?, ?, ?, ?, ?, ?)

        ON CONFLICT(album_id)
        DO UPDATE SET
            name = excluded.name,
            album_type = excluded.album_type,
            release_date = excluded.release_date,
            total_tracks = excluded.total_tracks,
            spotify_uri = excluded.spotify_uri
    `);

    statement.run(
        album.id,
        album.name,
        album.album_type,
        album.release_date,
        album.total_tracks,
        album.uri
    );
}


// ============================================================
// Tracks
// ============================================================

export function insertTrack(track) {
    const statement = db.prepare(`
        INSERT INTO tracks (
            track_id,
            name,
            album_id,
            duration_ms,
            explicit,
            spotify_uri
        )
        VALUES (?, ?, ?, ?, ?, ?)

        ON CONFLICT(track_id)
        DO UPDATE SET
            name = excluded.name,
            album_id = excluded.album_id,
            duration_ms = excluded.duration_ms,
            explicit = excluded.explicit,
            spotify_uri = excluded.spotify_uri
    `);

    // Convert explicit boolean to integer (0 or 1)
    const explicit = track.explicit == 'true' ? 1 : 0;


    statement.run(
        track.id,
        track.name,
        track.album.id,
        track.duration_ms,
        explicit,
        track.uri
    );
}


// ============================================================
// Playlists
// ============================================================

export function insertPlaylist(playlist) {
    const statement = db.prepare(`
        INSERT INTO playlists (
            playlist_id,
            name,
            description,
            spotify_uri
        )
        VALUES (?, ?, ?, ?)

        ON CONFLICT(playlist_id)
        DO UPDATE SET
            name = excluded.name,
            description = excluded.description,
            spotify_uri = excluded.spotify_uri
    `);

    statement.run(
        playlist.id,
        playlist.name,
        playlist.description,
        playlist.uri
    );
}


// ============================================================
// Track-Artist
// ============================================================

export function insertTrackArtist(trackId, artistId) {
    const statement = db.prepare(`
        INSERT OR IGNORE INTO track_artists (
            track_id,
            artist_id
        )
        VALUES (?, ?)
    `);

    statement.run(trackId, artistId);
}


// ============================================================
// Track-Playlist
// ============================================================

export function insertPlaylistTrack(playlistId, trackId) {
    const statement = db.prepare(`
        INSERT OR IGNORE INTO playlist_tracks (
            playlist_id,
            track_id
        )
        VALUES (?, ?)
    `);

    statement.run(
        playlistId,
        trackId
    );
}