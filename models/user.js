var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var UserSchema = new Schema({
	_id: Schema.Types.ObjectId,
    firstName: String,
	lastName: String,
	apiKey: String,
	isSuperAdmin: Boolean
});

module.exports = mongoose.model('User', UserSchema);