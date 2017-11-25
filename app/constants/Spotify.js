
// Spotify stuff
let SpotifyWebApi = require('spotify-web-api-node');

//const SPOTIFY_CLIENT_ID = 'feab0673a206476483fa11a3d81f260a';
const SPOTIFY_CLIENT_ID = '27981c0745974f79b2a0a7fa029cbd58';

let redirectUri = 'http://localhost:3000/callback';

// credentials are optional
let spotifyCredentials = {
  clientId : SPOTIFY_CLIENT_ID,
  redirectUri: redirectUri
};

let spotifyApi = new SpotifyWebApi(spotifyCredentials);

export default spotifyApi
