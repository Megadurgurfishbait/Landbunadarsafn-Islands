const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const events = new Schema( {
      title: String,
      description: String,
      date: Date
});

const ModelClassEvent = mongoose.model('events', events);


// Export the Model
module.exports = ModelClassEvent;
