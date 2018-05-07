const passport = require('passport');
const User = require('../models/user');
const config = require('../config');

// Incoming request ->         Passport Strategy ->         Route Handler
//                                                      /                \   
//                                                    /                    \
//                                          Strategy1        Strategy2
//                                              |                             |
//                                  Verify User          Verify user with a
//                                  with a JWT           username and password


const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
// Þar sem að localStrategy notar venjulega username í stað email þá segjum við í 
// local Option, localStrategy ef þú vilt finna username skoðaðu þá email property af request'inu.
const localOptions = { usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function( email, password, done){
      // Verfiy this email and password, call done with,
      // the user if it is the correct email and password,
      // otherwise, call done with false.
      User.findOne({email:email}, function(err, user){
            if(err) {return done(err);}
            if(!user) {return done(null, false);}
            // compare passwords - is 'password' equal to user.password?
            user.comparePassword(password, function(err, isMatch){
                  if( err ) { return done(err); }
                  // Ef að password er vitlaust. Þá sendum við false.
                  if(!isMatch) {return done(null, false);}
                  // Annars sendum við done og user fær token.
                  return done(null, user);
            });
      });
});
// Setup option for JWT Strategy
const jwtOptions = { 
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: config.secret
 };
// Create JWT Strategy
// Payload -> Decoded JWT Token
// Done -> Callback function ef að user er authenticated.
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
      // See if the user ID in the payload exists in our database
      // if it does, call 'done, with that
      // otherwise, call done without a user object -> Not authenticated.

      User.findById(payload.sub, function(err, user) {
            if (err) { return done(err, false); }

            if( user ) {
                  done(null, user);
            }else {
                  done(null, false);
            }
      });
});
// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

