const Photos = require('../models/frontpagephotos');


exports.setFrontpagePicture = function(req, res, next) {
  const newPhoto = new Photos({
    imgLocation: req.body.imgLocation
  });

  newPhoto
  .save()
  .then( result => {
    console.log(result);
  })

}

exports.getFrontpagePicture = function(req, res, next) {
  Photos.find({}, function (err, result)  {
    res.json(result);
  })

}

exports.deleteFrontpagephoto = function(req, res, next) {
  console.log(req.params.filename);

  Photos.remove({imgLocation: req.params.filename}, function (err, file) {
    if(err) return res.json(err);
    res.json(file);
  })
}
