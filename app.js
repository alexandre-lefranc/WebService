var express 	= require('express');
var mongoose 	= require('mongoose');
var bodyParser 	= require('body-parser');
var multer  	= require('multer');

var gracefulExit = function() { 
	mongoose.connection.close(function () {
		process.exit(0);
  });
}

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose default connection to DB disconnected');
	process.exit(-1);
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose ' + err);
	process.exit(-1);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

mongoose.connection.on('connected', function() {
	console.log("Connected to database");
	
	// global variables
	monumentModel = require('./models/monument.js');
	userModel = require('./models/user.js');
	
	var api = require('./controllers/api.js');
	var backoffice = require('./controllers/backoffice.js');
	
	var app = express();
	var router = express.Router();
		
	router.use(function (req, res, next) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		console.log('Client ' + ip + ' connected');
		next();
	});
	
	var jsonParser = bodyParser.json()
	var urlencodedParser = bodyParser.urlencoded({ extended: false })
	var multiPartParser = multer();
	// API
	router.get('/api/monument/:monumentId', api.getMonument);	
	router.post('/api/monuments', jsonParser, api.getNearMonuments);
	
	// Back Office
	router.get('/backoffice/', backoffice.getMonuments);
	router.post('/backoffice/monument/add', multiPartParser, urlencodedParser, backoffice.addMonument);
	router.get('/backoffice/monument/delete/:monumentId', urlencodedParser, backoffice.removeMonument);
	
	app.use(express.static(__dirname + '/static'));
	app.use(express.static(__dirname + '/uploads'));
	app.use('/', router);

	app.listen(8080, function() {
		var host = this.address().address;
		var port = this.address().port;

		console.log('Server listening at http://%s:%s', host, port);
	});
});

// Connect to local mongodb database
mongoose.connect('mongodb://localhost:27017/tourism');