const Authentication = require('./controllers/authentication');
const config = require('./config');
const frontpagephotos = require('./controllers/frontpagePhotos');
const passportService = require('./services/passport');
const Events = require('./controllers/events');
const mongoose = require('mongoose');
const crypto = require('crypto');
const passport = require('passport');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path')
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
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

      const storage = new GridFsStorage({
            url: config.mongodb,
            file: (req, file) => {
                  return new Promise((resolve, reject) => {
                        crypto.randomBytes(16, (err, buf) => {
                              if(err) {return reject(err);}
                              const filename1 = buf.toString('hex') + path.extname(file.originalname);
                              const fileInfo = {
                                    filename: filename1,
                                    bucketName: 'uploads'
                              };
                              resolve(fileInfo)
                        })
                  })
            }

      })
      const upload = multer({storage});
      app.post('/upload', upload.single('file'), (req, res) => {
            res.json({file: req.file});
      })

      app.get('/files', (req, res) => {
            gfs.db.collection('uploads' + '.files').find().toArray((err, files) => {
                  if(!files || files.length === 0){
                        return res.json({
                              err: 'no files exists'
                        });
                  }

                  return res.json(files);
            })
      })
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

      app.get('/image/:filename', (req, res) => {
            gfs.collection('uploads');
            gfs.files.findOne({filename:req.params.filename}, (err, file) => {
                console.log(gfs.db.collection('uploads' + '.files'))
                  if(!file || file.length === 0){
                        return res.status(404).json({
                              err: 'no files exists'
                        });
                  }

                  // Check if image
                  if(file.contentType === "image/jpeg" || file.contentType === 'image/png'){
                        const readstream = gfs.createReadStream(file.filename);
                        readstream.pipe(res);
                  }else{
                        res.status(404).json({
                              err: 'not an image'
                        });
                  }
            });
      })
      
      app.get('/file/:filename', (req, res) => {
            gfs.collection('uploads');
            gfs.files.findOne({filename:req.params.filename}, (err, file) => {
                console.log(gfs.db.collection('uploads' + '.files'))
                  if(!file || file.length === 0){
                        return res.status(404).json({
                              err: 'no files exists'
                        });
                  }

                  // Check if pdf
                  if(file.contentType === "application/pdf"){
                        const readstream = gfs.createReadStream(file.filename);
                        readstream.pipe(res);
                  }else{
                        res.status(404).json({
                              err: 'not an pdf file'
                        });
                  }
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
      app.delete('/removeImage/:id', bodyParser.json(), (req, res, next) => {
        var ObjectId = require('mongodb').ObjectId;
        var id = req.params.id;
        var o_id = new ObjectId(id);
        console.log(o_id);
        console.log(gfs.db.collection('uploads' + '.chunks'))
        gfs.collection('uploads').remove({_id:o_id}, function (err, result) {
          if(err) return res.json(err);
          res.json(result);
        })
      });

      app.delete('/removeImageChunks/:id', bodyParser.json(), (req, res, next) => {
        var ObjectId = require('mongodb').ObjectId;
        var id = req.params.id;
        var o_id = new ObjectId(id);
        console.log(o_id);
        gfs.db.collection('uploads' + '.chunks').remove({files_id:o_id}, function (err, result) {
          if(err) return res.json(err);
          res.json(result);
        })
      });


}
