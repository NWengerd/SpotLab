import {
    loginWithSpotify,
    handleCallback
} from "./spotifyAuth.js";


// Show initial login page, prompting user to sign in with Spotify
function showLoginPage() {

    // Prompt and button
    document.body.innerHTML = `
        <h1>Spotify API</h1>

        <button id="login-button">
            Login with Spotify
        </button>
    `;

    // Redirect user to Spotify's login page if button is pressed
    document
        .getElementById("login-button")
        .addEventListener(
            "click",
            loginWithSpotify
        );
}


async function showUserPage() {

    try {

        // const user =
        //     await getCurrentUser();

        document.body.innerHTML = `
            <h1>Spotify API</h1>

            <h2>
                Welcome,
            </h2>
        `;

    } catch (error) {

        console.error(error);

        document.body.innerHTML = `
            <h1>Something went wrong</h1>

            <p>
                ${error.message}
            </p>
        `;
    }
}


async function handleSpotifyCallback() {

    try {

        await handleCallback();

        // Remove the ?code=... from the URL
        window.history.replaceState(
            {},
            document.title,
            "/"
        );

        await showUserPage();

    } catch (error) {

        console.error(error);

        document.body.innerHTML = `
            <h1>Spotify Login Failed</h1>

            <p>
                ${error.message}
            </p>
        `;
    }
}


function main() {

    // If the user is on the callback page after logging into Spotify, handle the callback, otherwise show the login page
    if (
        window.location.pathname ===
        "/callback"
    ) {

        handleSpotifyCallback();

    } else {

        showLoginPage();
    }
}


main();