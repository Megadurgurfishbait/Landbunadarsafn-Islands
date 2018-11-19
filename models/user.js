
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model

const userSchema = new Schema( {
      
      email: { type: String, unique: true, lowercase: true },
      password: String

});

// On Save Hook, encrypt password
// Áður er að við sendum model í gagnagrunn, keyrum þetta function.
userSchema.pre('save', function(next){
      // Ná í aðgang að user. Hér er user instance af user.
      const user = this;


      // Býr til salt svo keyra callback.
      // Salt => Random strings of characters.
      // Salt er lykilinn að því að dulkóða lykilorðið tilbaka. 
      bcrypt.genSalt(10, function (err, salt){
            if(err) {return next(err);}



            // Hash'a passwordið með því að nota salt.
            bcrypt.hash(user.password, salt, null, function(err, hash){
                  if(err) { return next(err);}


                  //Overwrite plain text password with encrypted password
                  user.password = hash;
                  next();

            });
      });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
      bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
            if(err) {return callback(err);}

            callback(null, isMatch);
      });
}

// Create the Model class
// 'user' er collection'ið í MongoDB
const ModelClass = mongoose.model('user', userSchema);


// Export the Model
module.exports = ModelClass;