
// Spotify stuff
let SpotifyWebApi = require('spotify-web-api-node');

const SPOTIFY_CLIENT_ID = 'feab0673a206476483fa11a3d81f260a';
const SPOTIFY_CLIENT_SECRET = 'ea224f2edaf248f1a26caa30b842c110';

let redirectUri = 'http://localhost:3000/callback';

// credentials are optional
let spotifyCredentials = {
  clientId : SPOTIFY_CLIENT_ID,
  clientSecret : SPOTIFY_CLIENT_SECRET,
  redirectUri: redirectUri
};

let spotifyApi = new SpotifyWebApi(spotifyCredentials);

export default spotifyApi
