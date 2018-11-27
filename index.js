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

app.use(morgan('combined'));
app.use(cors());
app.use(express.static(path.join(__dirname, '/Client/build')));
router(app);
app.use(bodyParser.json({type: '*/*'}));

app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname, '/Client/build/index.html'));
});

// Portin sem að við erum að nota
const port = process.env.PORT || 8000;

// Tengir http request við appið okkar.
const server = http.createServer(app);
server.listen(port);
