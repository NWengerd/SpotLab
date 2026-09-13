-- ============================================================
-- Spotify Music Analysis Database
-- ============================================================


PRAGMA foreign_keys = ON;


-- ============================================================
-- ARTISTS
--
-- One row per unique Spotify artist.
-- ============================================================

CREATE TABLE artists (
    artist_id   TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    spotify_uri TEXT
);


-- ============================================================
-- ALBUMS
--
-- One row per unique Spotify album.
-- ============================================================

CREATE TABLE albums (
    album_id     TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    total_tracks INTEGER,
    release_date TEXT,
    album_type   TEXT,
    spotify_uri  TEXT
);


-- ============================================================
-- TRACKS
--
-- One row per unique Spotify track.
--
-- Each track can point to one album.
--
-- Artists are NOT stored directly here because a track can
--      have multiple artists. The track_artists table handles
--      that relationship.
-- ============================================================

CREATE TABLE tracks (
    track_id    TEXT PRIMARY KEY,
    name        TEXT NOT NULL,

    album_id    TEXT,

    duration_ms INTEGER,

    explicit    INTEGER NOT NULL DEFAULT 0
                CHECK (explicit IN (0, 1)),

    spotify_uri TEXT,

    FOREIGN KEY (album_id)
        REFERENCES albums(album_id)
);


-- ============================================================
-- PLAYLISTS
--
-- One row per unique Spotify playlist.
-- ============================================================

CREATE TABLE playlists (
    playlist_id   TEXT PRIMARY KEY,

    name          TEXT NOT NULL,

    description   TEXT,

    public        INTEGER
                  CHECK (public IN (0, 1)),

    collaborative INTEGER NOT NULL DEFAULT 0
                  CHECK (collaborative IN (0, 1)),

    spotify_uri   TEXT
);


-- ============================================================
-- TRACK_ARTISTS
--
-- Connects tracks and artists.
-- ============================================================

CREATE TABLE track_artists (
    track_id  TEXT NOT NULL,
    artist_id TEXT NOT NULL,

    PRIMARY KEY (
        track_id,
        artist_id
    ),

    FOREIGN KEY (track_id)
        REFERENCES tracks(track_id),

    FOREIGN KEY (artist_id)
        REFERENCES artists(artist_id)
);


-- ============================================================
-- PLAYLIST_TRACKS
--
-- Connects playlists and tracks.
-- ============================================================

CREATE TABLE playlist_tracks (
    playlist_id TEXT NOT NULL,
    track_id    TEXT NOT NULL,

    added_at    TEXT,

    PRIMARY KEY (
        playlist_id,
        track_id
    ),

    FOREIGN KEY (playlist_id)
        REFERENCES playlists(playlist_id),

    FOREIGN KEY (track_id)
        REFERENCES tracks(track_id)
);


-- ============================================================
-- INDEXES
--
-- Primary keys already have indexes created by SQLite.
--
-- These additional indexes make common relationship lookups
-- faster.
-- ============================================================

-- Find tracks belonging to a particular album.
CREATE INDEX idx_tracks_album
    ON tracks(album_id);


-- Find all tracks belonging to an artist.
CREATE INDEX idx_track_artists_artist
    ON track_artists(artist_id);


-- Find all playlists containing a particular track.
CREATE INDEX idx_playlist_tracks_track
    ON playlist_tracks(track_id);


-- Find all tracks belonging to a particular playlist.
CREATE INDEX idx_playlist_tracks_playlist
    ON playlist_tracks(playlist_id);