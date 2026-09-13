import {
    getPlaylists
    
} from "./spotifyApi.js";
import {importPlaylistData, importPlaylists} from "./importer.js";


importPlaylists();

const playlists =
    await getPlaylists();


const playlist =
    playlists[0];


console.log(
    `Testing playlist: ${playlist.name}\n`
);


await importPlaylistData(
    playlist
);


console.log(
    "\nImport successful."
);