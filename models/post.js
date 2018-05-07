const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema( {
      title: String,
      createdAt: String,
      text:  String,
      headingImg:String,
      filePath: [String]
});

const ModelClassPost = mongoose.model('post', postSchema);

   
// Export the Model
module.exports = ModelClassPost;
