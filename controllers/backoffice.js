var fs 		 = require('fs');
var utils 	 = require('../utils.js');
var mongoose = require('mongoose');

module.exports.getMonuments = function(req, res) {
    return monumentModel.find(function(err, monuments) {
        if (err) return res.status(500).end("Internal error: " + err);

        res.render('../views/monuments.ejs', {monuments: monuments});
    });
}

module.exports.addMonument = function(req, res) {
    if (!req.body || req.body === 'undefined') return res.status(400).end("Empty request");

    if (!req.body.name ||
        !req.body.address ||
        !req.body.description ||
        !req.body.longitude ||
        !req.body.latitude)
        return res.status(400).end("Empty field");
	
    var monument = new monumentModel({  name: req.body.name,
                                        address: req.body.address,
                                        description: req.body.description,
                                        location: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
                                     });

    return monument.save(function(err, data) {
        if (err) return res.status(500).end("Internal error: " + err);
        console.log("New monument '"  + data.name + "' added");
		if (req.files && req.files.image)
		{
			var fileName = data._id + "." + utils.getExtension(req.files.image.name.toLowerCase());
			fs.readFile(req.files.image.path, function(err, data) {
				if (err) console.log(err);
				var newPath = __dirname + "/../uploads/" + fileName;
				fs.writeFile(newPath, data, function(err) {
					if (err) console.log(err);
				});
			});
		}
        res.redirect('/backoffice/');
    });
}

module.exports.removeMonument = function(req, res) {
    var monumentId = req.params.monumentId;

	if (!monumentId || monumentId === 'undefined' || !mongoose.Types.ObjectId.isValid(monumentId))
		return res.status(400).end("Invalid value: Invalid ObjectId");

    return monumentModel.findById(monumentId, function(err, monument) {
        if (err) return res.status(500).end("Internal error: " + err);
		if (!monument) return res.redirect('/backoffice/');
		
        return monument.remove(function(err, monument) {
            if (err) return res.status(500).end("Internal error: " + err);
            console.log("Monument '"  + monument.name + "' removed");
            res.redirect('/backoffice/');
        });
    });
}