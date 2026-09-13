import http from "http";
import { saveTokens } from "./tokenManager.js";

const allowedOrigin =
    "http://127.0.0.1:5173";

const PORT = 3000;

const clientId = "1d4cd7bbe974440ebcfd0d3bcd023fa0";
const redirectUri = "http://127.0.0.1:5173/callback";

const server = http.createServer(async (req, res) => {
    // --------------------------------------------------------
    // CORS
    // --------------------------------------------------------

    res.setHeader(
        "Access-Control-Allow-Origin",
        allowedOrigin
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // Handle browser preflight request

    if (req.method === "OPTIONS") {

        res.writeHead(204);

        res.end();

        return;
    }

    
    // --------------------------------------------------------
    // Spotify callback
    // --------------------------------------------------------

    if (
        req.method === "POST" &&
        req.url === "/auth/callback"
    ) {

        try {

            // Collect request body
            let body = "";

            for await (const chunk of req) {
                body += chunk;
            }

            const {
                code,
                codeVerifier
            } = JSON.parse(body);

            if (!code || !codeVerifier) {

                res.writeHead(400);
                res.end(
                    "Missing code or code verifier."
                );

                return;
            }


            // ------------------------------------------------
            // Exchange authorization code for tokens
            // ------------------------------------------------

            const response = await fetch(
                "https://accounts.spotify.com/api/token",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body: new URLSearchParams({

                        client_id: clientId,

                        grant_type:
                            "authorization_code",

                        code: code,

                        redirect_uri:
                            redirectUri,

                        code_verifier:
                            codeVerifier
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "Spotify token error:",
                    data
                );

                res.writeHead(
                    response.status,
                    {
                        "Content-Type":
                            "application/json"
                    }
                );

                res.end(
                    JSON.stringify(data)
                );

                return;
            }


            // ------------------------------------------------
            // Save tokens to tokens.json
            // ------------------------------------------------

            saveTokens(data);


            // ------------------------------------------------
            // Tell browser everything worked
            // ------------------------------------------------

            res.writeHead(
                200,
                {
                    "Content-Type":
                        "application/json"
                }
            );

            res.end(
                JSON.stringify({
                    success: true
                })
            );

        } catch (error) {

            console.error(error);

            res.writeHead(500);

            res.end(
                "Internal server error."
            );
        }

        return;
    }


    // --------------------------------------------------------
    // Default route
    // --------------------------------------------------------

    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end(
        "Spotify Node server is running."
    );
});


server.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );
    }
);