const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const frontPageschema = new Schema( {
      title: String,
      imgLocation: String
});

const ModelClassFrontPage = mongoose.model('fontpagePhotos', frontPageschema);


// Export the Model
module.exports = ModelClassFrontPage;
