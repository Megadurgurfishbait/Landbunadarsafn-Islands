const Authentication = require('./controllers/authentication');
const config = require('./config');
const frontpagephotos = require('./controllers/frontpagePhotos');
const passportService = require('./services/passport');
const Events = require('./controllers/events');
const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const Grid = require('gridfs-stream');
var tinify = require('tinify');
tinify.key = "b46Yf2kc4VWdZ29vEFFygnk5JslMWuY6";


const conn = mongoose.createConnection(config.mongodb);
let gfs;
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
                  console.log(request);
                  console.log(file.originalname);
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
                  console.log("Calling");
                  
                  const response = await s3.listObjectsV2({
                        Bucket: "geymsla",
                        Prefix: "images"
                  }).promise();
                  res.send(response.Contents)
                }
          )

          app.get('/files:filename', async function (req, res) {    
            const response = await s3.listObjectsV2({
                  Bucket: "geymsla",
                  Prefix: "images"
            }).promise();
            res.send(response.Contents)
          }
    )

      app.get('/posts', bodyParser.json() ,Authentication.getPosts);

      app.get('/post/:postname', bodyParser.json(), Authentication.getSinglePost);
      app.put('/post/:id', bodyParser.json(), Authentication.updatePost);


      app.get('/files/:filename', (req, res) => {

            gfs.db.collection('uploads' + '.files').findOne({filename:req.params.filename}, (err, file) => {
                  if(!file || file.length === 0){
                        return res.status(404).json({
                              err: 'no files exists'
                        });
                  }

                  return res.json(file);
            });
      })
      
      
      // Allar umsóknir sem að vilja komast inná '/' route verður
      // fyrst að fara i gegnum requireAuth til að komast áfram.
      app.get('/', requireAuth, function(req, res) {
            res.send({message: 'Super secret code is ABC123'});
      });

      app.post('/frontpagephoto', bodyParser.json(), frontpagephotos.setFrontpagePicture);
      app.get('/frontpagephotos', bodyParser.json(), frontpagephotos.getFrontpagePicture);
      app.delete('/deleteFrontpagephoto/:filename', bodyParser.json(), frontpagephotos.deleteFrontpagephoto);


      app.post('/events', bodyParser.json(), Events.createEvent);
      app.get('/events', bodyParser.json(), Events.getEvents);



      app.post('/signin',bodyParser.json(), requireSignin, Authentication.signin);
  // Req => Request
  // Res => Response -> það sem að við sendu til baka á þann sem að sendi Request
  // Next => Error Handling
      app.post('/post', bodyParser.json(), Authentication.uploadPost);

      app.post('/signup',bodyParser.json() , Authentication.signup);


      app.delete('/removepost/:id', bodyParser.json(), Authentication.deletePost);

}
