import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokenPath = path.join(
    __dirname,
    "..",
    "tokens.json"
);

const clientId = "1d4cd7bbe974440ebcfd0d3bcd023fa0";


// ------------------------------------------------------------
// Save tokens
// ------------------------------------------------------------

export function saveTokens(data) {

    const tokens = {
        access_token: data.access_token,

        refresh_token:
            data.refresh_token ?? null,

        expires_at:
            Date.now() + data.expires_in * 1000
    };

    fs.writeFileSync(
        tokenPath,
        JSON.stringify(tokens, null, 4)
    );

    console.log("Tokens saved.");
}


// ------------------------------------------------------------
// Load tokens
// ------------------------------------------------------------

export function loadTokens() {

    if (!fs.existsSync(tokenPath)) {
        return null;
    }

    return JSON.parse(
        fs.readFileSync(tokenPath, "utf8")
    );
}


// ------------------------------------------------------------
// Get a valid access token
// ------------------------------------------------------------

export async function getValidAccessToken() {

    const tokens = loadTokens();

    if (!tokens) {

        throw new Error(
            "No Spotify tokens found. Please log in."
        );
    }


    // --------------------------------------------------------
    // Access token is still valid
    // --------------------------------------------------------

    if (
        tokens.access_token &&
        Date.now() < tokens.expires_at
    ) {

        return tokens.access_token;
    }


    // --------------------------------------------------------
    // Access token has expired
    // --------------------------------------------------------

    console.log(
        "Access token expired. Refreshing..."
    );


    if (!tokens.refresh_token) {

        throw new Error(
            "No refresh token found. Please log in again."
        );
    }


    // --------------------------------------------------------
    // Ask Spotify for a new access token
    // --------------------------------------------------------

    const response = await fetch(
        "https://accounts.spotify.com/api/token",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body: new URLSearchParams({

                client_id:
                    clientId,

                grant_type:
                    "refresh_token",

                refresh_token:
                    tokens.refresh_token
            })
        }
    );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            `Token refresh failed: ${JSON.stringify(data)}`
        );
    }


    // --------------------------------------------------------
    // Save the new access token
    // --------------------------------------------------------

    const newTokens = {

        access_token:
            data.access_token,

        refresh_token:
            data.refresh_token ??
            tokens.refresh_token,

        expires_at:
            Date.now() +
            data.expires_in * 1000
    };


    fs.writeFileSync(
        tokenPath,
        JSON.stringify(
            newTokens,
            null,
            4
        )
    );


    console.log(
        "Access token refreshed."
    );


    return newTokens.access_token;
}