import db from "./database.js";

const statement = db.prepare(`
        select * from playlist_tracks;
    `);

    statement.run();
    console.log(statement.all());