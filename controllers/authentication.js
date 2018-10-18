const jwt = require('jwt-simple');
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

exports.getPosts = function(req, res){

  Post.find({}, null, {sort: {createdAt: -1 }}, function (err, result)  {
    res.json(result);
  })
}

exports.getSinglePost = function (req, res) {
  var ObjectId = require('mongodb').ObjectId;
  var id = req.params.postname;
  var o_id = new ObjectId(id);
  Post.find({_id:o_id}, function (err, result) {
    if(err) return res.json(err);
    res.json(result);
  })
}

exports.signin = function(req, res, next){
      // User has already had their email and password auth'd
      // We just need to give them a token.
      res.send({ token: tokenForUser(req.user)});
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
exports.uploadPost = function(req, res, next){
      console.log(req.body);
      /*
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      var todayDate = `${dd}/${mm}/${yyyy}`;
      */


      const newPost = new Post({
            title: req.body.title,
            createdAt: req.body.createdAt,
            text: req.body.text,
            headingImg: req.body.headingPath,
            filePath: req.body.filePath
      });
      newPost
            .save()
            .then( result => {
                  console.log(result);
            })
}

exports.deletePost = function(req, res, next) {
  var ObjectId = require('mongodb').ObjectId;
  var id = req.params.id;
  var o_id = new ObjectId(id);
  console.log(o_id);
  Post.remove({_id:o_id}, function (err, result) {
    if(err) return res.json(err);
    res.json(result);
  })
}



exports.updatePost = function(req, res, next) {
  var ObjectId = require('mongodb').ObjectId;
  var id = req.params.id;
  var o_id = new ObjectId(id);
  console.log(req.params.id);
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
