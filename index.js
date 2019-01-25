// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const router = require('./router');
const config = require('./config');
const path = require('path');
const compression = require('compression')

// DB Setup

mongoose.connect(config.mongodb);
mongoose.connection.once('open', function(){
      console.log('connection has been made, now make fireworks');
}).on('error', function(error){
      console.log('Connection error', error);
});

// App Setup
// .Use gerir hlutina að middleware
// Morgan er logging middleware.
app.use(compression());
app.use(morgan('combined'));
app.use(cors());

<<<<<<< HEAD
app.use('/pdfupload', express.static('./static/media/'));
app.use(express.static('static'));
=======

app.use('/pdfupload', express.static('./static/media/'));
app.use(express.static(path.join(__dirname, 'build'), {maxAge: "50d"}))

>>>>>>> 9e35bf862ef80ada93ae8fab6e6d6445e9858356
router(app);

app.get('/', function(req, res) {
<<<<<<< HEAD
=======
      res.sendFile(path.join(__dirname, '/index.html'));
>>>>>>> 9e35bf862ef80ada93ae8fab6e6d6445e9858356
});

app.get('/skrainn', (req, res) => {
      res.sendFile(path.join(__dirname, 'build/index.html'));
  });

  app.get('/frettir/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build/index.html'));
  });

  app.get('/frodleikur', (req, res) => {
      res.sendFile(path.join(__dirname, 'build/index.html'));
  });

  app.get('/english', (req, res) => {
      res.sendFile(path.join(__dirname, 'build/index.html'));
  });

  app.get('/opnunartimar', (req, res) => {
      res.sendFile(path.join(__dirname, 'build/index.html'));
  });

  app.get('/eldrifrettir', (req, res) => {
      res.sendFile(path.join(__dirname, 'build/index.html'));
  });

  app.get('/*', (req, res) => {
        res.redirect('/');
  });



app.use(bodyParser.json({type: '*/*'}));




// Portin sem að við erum að nota
const port = process.env.PORT || 3000;

// Tengir http request við appið okkar.
const server = http.createServer(app);
server.listen(port);
