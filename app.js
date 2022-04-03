require('dotenv').config();

const express = require('express');
const { get } = require('express/lib/response');
const hbs = require('hbs');

// require spotify-web-api-node package here:ç
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:

app.get('/', (request, response) => {
  response.render('home');
});

app.get('/artist-search', (request, response) => {
  const artist = request.query.artist;

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      response.render('artist-search-results', {
        results: data.body.artists.items,
        buttonText: 'View Albums',
        search: artist
      });
    })
    .catch((err) => console.log('The following error occured: ', err));
});

app.get('/albums/:artistId', (request, response) => {
  const artistID = request.params.artistId;
  spotifyApi
    .getArtistAlbums(`${artistID}`)
    .then((data) => {
      console.log('Albums: ', data.body.items);
      response.render('albums', {
        results: data.body.items,
        buttonText: 'View Tracks'
      });
    })
    .catch((err) => console.log('Error is: ', err));
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
