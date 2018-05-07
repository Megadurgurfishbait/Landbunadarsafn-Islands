const Event = require('../models/events');
const ObjectID = require('mongodb').ObjectID;
const objectId = new ObjectID();


exports.createEvent = function( req, res, next ){
  console.log(req.body);

  const newEvent = new Event({
    title: req.body.title,
    description: req.body.description,
    date:  req.body.date,
    show: req.body.show
  });

  newEvent
  .save()
  .then(result => {
    console.log(result);
  })
}

exports.getEvents = function (req, res, next){
  Event.find({}, function (err, result) {
    res.json(result);
  })
}
