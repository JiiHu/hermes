
// Spotify stuff
let SpotifyWebApi = require('spotify-web-api-node');

let inDev = false;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  inDev = true;
}

const SPOTIFY_CLIENT_ID = (inDev ? '27981c0745974f79b2a0a7fa029cbd58' : 'feab0673a206476483fa11a3d81f260a');

let redirectUri = (inDev ? 'http://localhost:3000/callback' : 'http://spoti.fyi/callback');

// credentials are optional
let spotifyCredentials = {
  clientId : SPOTIFY_CLIENT_ID,
  redirectUri: redirectUri
};

let spotifyApi = new SpotifyWebApi(spotifyCredentials);

export default spotifyApi
