require('dotenv').config();
const { response } = require('express');
const express = require('express');
const hbs = require('hbs');
// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
})

app.get('/artist-search', (req, res, next) => {
    let name = req.query.artista
    console.log(name)
    if(!name){
        res.render('index')
    } 
    spotifyApi 
  . searchArtists (name) 
  . then ( data  =>  { 
    //rs
    //console.log ( 'Los datos recibidos de la API:' ,  data.body.artists.items[0])
    res.render('artist-search-results', {artistes: data.body.artists.items}) ; 
  } ) 
  . catch ( err  =>  console . log ( 'El error al buscar artistas ocurrió:' ,  err ) );
})

app.get('/albums/:id', (req, res, next) => {
    let albumes = req.params.id;
  spotifyApi
  .getArtistAlbums(albumes)
  .then( data => {
      console.log(data.body)
      res.render('albums', {albumes: data.body.items})
    })
    .catch (err => console.log(err))
    })
    
  app.get('/tracks/:id', (req,res,next)=>{
    let trackes = req.params.id;
    spotifyApi.getAlbumTracks(trackes)
    .then( data => {
        console.log(data.body)
        res.render('tracks', {trackes: data.body.items})
      })
      .catch (err => console.log(err))
      })



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
