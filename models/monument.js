var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var MonumentSchema = new Schema({
    name: String,
	address: String,
	description: String,
	location: {type: [], index: '2d'}, /* [ <longitude> , <latitude> ] */
	image: { data: Buffer, contentType: String, required: false }
});

module.exports = mongoose.model('Monument', MonumentSchema);