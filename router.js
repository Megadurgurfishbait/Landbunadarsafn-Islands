const Authentication = require('./controllers/authentication');


const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const Grid = require('gridfs-stream');
const passportService = require('./services/passport');


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
            })
          }).array('file', 1);


          app.post('/upload', function (request, response, next) {
            upload(request, response, function (error) {
              if (error) {
                console.log(error);
              }
              console.log('File uploaded successfully.');
            });
          });


          app.get('/files', async function (req, res) {
                  const response = await s3.listObjectsV2({
                        Bucket: "geymsla",
                        Prefix: "images"
                  }).promise();
                  console.log(res);
                  res.send(response.Contents)
                }
          )

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

      
      // Allar umsóknir sem að vilja komast inná '/' route verður
      // fyrst að fara i gegnum requireAuth til að komast áfram.
      app.get('/', requireAuth, function(req, res) {
            res.send({message: 'Super secret code is ABC123'});
      });

      app.post('/signin',bodyParser.json(), requireSignin, Authentication.signin);
  // Req => Request
  // Res => Response -> það sem að við sendu til baka á þann sem að sendi Request
  // Next => Error Handling
      app.post('/post', bodyParser.json(), Authentication.uploadPost);
      app.post('/signup',bodyParser.json() , Authentication.signup);
      app.delete('/removepost/:id', bodyParser.json(), Authentication.deletePost);
}
