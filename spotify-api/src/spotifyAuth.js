const clientId = "1d4cd7bbe974440ebcfd0d3bcd023fa0";
const redirectUri = "http://127.0.0.1:5173/callback";


// Generate the random PKCE verifier
function generateCodeVerifier(length) {

    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

    let text = "";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(
            Math.floor(Math.random() * possible.length)
        );
    }

    return text;
}


// Convert the verifier into the PKCE challenge
async function generateCodeChallenge(codeVerifier) {

    const data =
        new TextEncoder().encode(codeVerifier);

    const digest =
        await window.crypto.subtle.digest(
            "SHA-256",
            data
        );

    const bytes =
        new Uint8Array(digest);

    const binaryString =
        String.fromCharCode(...bytes);

    const base64 =
        btoa(binaryString);

    return base64
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}


// Send the user to Spotify's login page with necessary parameters for PKCE authentication
export async function loginWithSpotify() {

    // Generate code verifier and challenge
    const codeVerifier =
        generateCodeVerifier(64);

    localStorage.setItem(
        "code_verifier",
        codeVerifier
    );
    const codeChallenge =
        await generateCodeChallenge(
            codeVerifier
        );

    
    // Create requisite parameters for authorization URL
    const params = new URLSearchParams({

        client_id: clientId,

        response_type: "code",

        redirect_uri: redirectUri,

        scope:
            "playlist-read-private playlist-read-collaborative",

        code_challenge_method: "S256",

        code_challenge: codeChallenge
    });

    // Create URL
    const authorizationUrl =
        "https://accounts.spotify.com/authorize?" +
        params.toString();

    // Redirect user to URL, which is Spotify's login page
    window.location.href =
        authorizationUrl;
}


// Exchange the authorization code for an access token
export async function handleCallback() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const code =
        params.get("code");

    const codeVerifier =
        localStorage.getItem(
            "code_verifier"
        );

    if (!code || !codeVerifier) {

        throw new Error(
            "Missing authorization code or code verifier."
        );
    }


    // Send the authorization code and
    // PKCE verifier to our Node server.

    const response = await fetch(
        "http://localhost:3000/auth/callback",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                code: code,
                codeVerifier: codeVerifier
            })
        }
    );


    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }


    const data =
        await response.json();


    // The Node server now owns the tokens.
    // We no longer need the verifier.
    localStorage.removeItem(
        "code_verifier"
    );


    console.log(
        "Spotify authentication successful."
    );


    return data;
}