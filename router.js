const Authentication = require('./controllers/authentication');
const path = require('path');
<<<<<<< HEAD
const fs = require('fs');
=======
>>>>>>> 9e35bf862ef80ada93ae8fab6e6d6445e9858356
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const Grid = require('gridfs-stream');
const passportService = require('./services/passport');

// PDF UPLOADS //////////////////////////////////////////
const PDFStorage = multer.diskStorage({
      destination: function(req, file, cb){
            cb(null, './static/media/');
      },
      filename: function(req, file, cb){
            cb(null, file.originalname);
      }
});

const fileFilter = (req, file , cb) => {
      // Reject File
      if(file.mimetype === "application/pdf"){
            cb(null, true);
      }else {
            cb(new Error("Ekki pdf skjal."), false);
      }
}
const PDFupload = multer({
      storage: PDFStorage,
      fileFilter: fileFilter
});



/////////////////////////////////////////////////////////


// PDF UPLOADS //////////////////////////////////////////
const PDFStorage = multer.diskStorage({
      destination: function(req, file, cb){
            cb(null, './static/media/');
      },
      filename: function(req, file, cb){
            cb(null, file.originalname);
      }
});

const fileFilter = (req, file , cb) => {
      // Reject File
      if(file.mimetype === "application/pdf"){
            cb(null, true);
      }else {
            cb(new Error("Ekki pdf skjal."), false);
      }
}
const PDFupload = multer({
      storage: PDFStorage,
      fileFilter: fileFilter
});



/////////////////////////////////////////////////////////



const conn = mongoose.createConnection(config.mongodb);
const bodyParser = require('body-parser');
// Session False notum við til að segja að við ætlum ekki að nota cookie based session.
// Þetta er kall á middleware til að sjá hvort að notandi megi fara inn á ákveðna route.
const requireAuth = passport.authenticate('jwt', {session: false });
const requireSignin = passport.authenticate('local',{session: false});

module.exports = function (app) {

      conn.once('open',() => {
            gfs = Grid(conn.db, mongoose.mongo);
      });
      const spacesEndpoint = new aws.Endpoint('ams3.digitaloceanspaces.com');
      const s3 = new aws.S3({
            endpoint: spacesEndpoint
            });


      const upload = multer({
            storage: multerS3({
              s3: s3,
              bucket: 'geymsla/images',
              acl: 'public-read',
              key: function (request, file, cb) {
             cb(null, file.originalname);
              }
            }
            )
          }).array('file', 1);

<<<<<<< HEAD
=======



>>>>>>> 9e35bf862ef80ada93ae8fab6e6d6445e9858356
          app.post('/upload', function (request, response, next) {
            upload(request, response, function (error) {
              if (error) {
                response.send(error);
              }
              response.send('File uploaded successfully.');
            });
          });


          app.post('/pdfupload', PDFupload.single('PDF'), function (req, res, next)  {});


          app.get('/files', async function (req, res) {
                  const response = await s3.listObjectsV2({
                        Bucket: "geymsla",
                        Prefix: "images"
                  }).promise();
                  res.send(response.Contents)
                }
          )
<<<<<<< HEAD
=======


          app.post('/pdfupload', PDFupload.single('PDF'), function (req, res, next)  {
          });

>>>>>>> 9e35bf862ef80ada93ae8fab6e6d6445e9858356
          app.get('/files/:filename', async function (req, res) {    
            const response = await s3.listObjectsV2({
                  Bucket: "geymsla",
                  Prefix: "images"
            }).promise();
            res.send(response.Contents)
          }
    )



      app.get('/posts', bodyParser.json() ,Authentication.getPosts);
      app.get('/frontPosts', bodyParser.json() ,Authentication.getFrontPosts);

      app.get('/post/:postname', bodyParser.json(), Authentication.getSinglePost);
      app.put('/post/:id', bodyParser.json(), Authentication.updatePost);


      app.post('/signin',bodyParser.json(), requireSignin, Authentication.signin);
  // Req => Request
  // Res => Response -> það sem að við sendu til baka á þann sem að sendi Request
  // Next => Error Handling
      app.post('/post', bodyParser.json(), Authentication.uploadPost);
      app.post('/signup',bodyParser.json() , Authentication.signup);
      app.delete('/removepost/:id', bodyParser.json(), Authentication.deletePost);
}
