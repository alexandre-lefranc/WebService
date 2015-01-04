var mongoose = require('mongoose');

module.exports.getMonument = function(req, res) {
	var monumentId = req.params.monumentId;

	if (!monumentId || monumentId === 'undefined' || !mongoose.Types.ObjectId.isValid(monumentId))
		return res.status(400).end("Invalid value: Invalid ObjectId");

	return monumentModel.find({_id: monumentId}, {_id: 0, location: 0}, function(err, monument) {
		if (err) return res.status(500).end("Internal error: " + err);
		if (!monument || monument.length <= 0) return res.status(404).end("Id " + monumentId + " not found");

		res.setHeader('Content-Type', 'application/json');
		return res.end(JSON.stringify(monument));
	});
}

module.exports.getNearMonuments = function(req, res) {
	if (!req.is('application/json')) return res.status(400).end("Expected JSON request");
	if (!req.body || req.body === 'undefined') return res.status(400).end("Empty request");

	var location = req.body.location;

	if (!location || location === 'undefined') return res.status(400).end("location not found");

	var longitude = location.longitude;
	if (!longitude || longitude === 'undefined') return res.status(400).end("longitude not found");

	var latitude = location.latitude;
	if (!latitude || latitude === 'undefined') return res.status(400).end("latitude not found");

	return monumentModel.find( { location : { $near : [ longitude, latitude ], $maxDistance: 50.0 } }, function(err, monuments) {
		if (err) return res.status(500).end("Internal error: " + err);

		res.setHeader('Content-Type', 'application/json');
		return res.end(JSON.stringify(monuments));
	});
}
