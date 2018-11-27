const jwt = require('jwt-simple');
const passport = require('passport'); // EKKI EYÐA ÚT
const config = require('../config');
const User = require('../models/user');
const Post = require('../models/post');
const ObjectID = require('mongodb').ObjectID;

const objectId = new ObjectID();

function tokenForUser(user){
      const timestamp = new Date().getTime();
      // Fyrri parturinn af function: hvaða partur af schema'inu viljum við endcode'a
      // Seinni parturinn: strengurinn sem að við gerðum sjálf.
      // Sub => Subject. Hver á þennan token*
      // iat => issued at time.
      // config.secret er sá stengur sem að við bjuggum til sjálf í root dir.
      return jwt.encode( { sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function (req, res, next) {
      console.log(req.body.email);

      // Náum í hlutina sem að er sent frá /signup.
      const email = req.body.email;
      const password = req.body.password;

      if(!email || !password){
            return res.status(422).send({error: 'You must provide email and password!'});
      }

      // Ef að user er til, þá sendum við error message.
      User.findOne({ email: email }, function (err, existingUser){
            if(err) { return next(err);}

            // Ef að user ER TIL þá sendum við error sem sendir á síðuna okkar "Email is in use"
            if(existingUser){
                  return res.status(422).send({error: 'Email is in use'});
            }


      // Ef að emailið er ekki til sem að við fáum þá búum við til nýjan object með upplýsingum frá user.
            const user = new User({
                  email: email,
                  password: password
            });

            user.save(function(err) {
                  // Ef að það kemur error sendum við til baka

                  if(err) {return next(err);}

                  // Hér save'um við userinn í gagnagrunninn.
                  res.json({token: tokenForUser(user)});
            });
      });
}

exports.signin = function(req, res, next){
      // User has already had their email and password auth'd
      // We just need to give them a token.
      console.log("HER ER EG");
      res.send({ token: tokenForUser(req.user)});

}

exports.getPosts = function(req, res){
  Post.find({}, null, {sort: {createdAt: -1 }, select: '-headingImg -filePath -text'}, function (err, result)  {
      console.log("HER!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result);
    res.json(result);
  })
}

exports.getFrontPosts = function(req, res){
            Post.find({}, null, {sort: {createdAt: -1 }, limit:4, select: '-filePath' }, function (err, result)  {
                  console.log("HER!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result);
        res.json(result);
        
      })
    }

exports.getSinglePost = function (req, res, next) {
  var ObjectId = require('mongodb').ObjectId;
  var id = req.params.postname;
  var o_id = new ObjectId(id);
  Post.find({_id:o_id}, function (err, result) {
    if(err) return res.json(err);
    res.json(result);
  })
}


exports.uploadPost = function(req, res, next){

      let newPost = new Post({
            title: req.body.title,
            createdAt: req.body.createdAt,
            text: req.body.text,
            headingImg: req.body.headingPath,
            filePath: req.body.filePath
      });
 
      newPost.save(function(error, post) {
            if(error){
                  console.error("YO ERRO IS: ", error);
            }

            console.log("YO SHIT HAS BEEN SAVED", post);
            return res.json(post);

            });
}

exports.deletePost = function(req, res, next) {
  var ObjectId = require('mongodb').ObjectId;
  var id = req.params.id;
  var o_id = new ObjectId(id);

  Post.remove({_id:o_id}, function (err, result) {
    if(err) return res.json(err);
    res.json(result);
  })
}



exports.updatePost = function(req, res, next) {
  var ObjectId = require('mongodb').ObjectId;
  var id = req.params.id;
  var o_id = new ObjectId(id);

  Post.findOneAndUpdate(
      {_id:o_id},
      {
        title : req.body.title,
        text : req.body.text,
        headingImg : req.body.headingPath,
        filePath : req.body.filePath
      }).then(post => {
        console.log(post);
        res.json(post)
      });
}
