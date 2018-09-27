// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
	return res.send('Hello! The API is at http://localhost:' + port + '/api');
});


// API ROUTES -------------------
// get an instance of the router for api routes
var apiRoutes = express.Router(); 

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
	return res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/status/:ip',function(req,res){
	var ip = req.params.ip;
	if (ip){
		var hosts = [ip];
		hosts.forEach(function(host){
		    ping.sys.probe(host, function(isAlive){
		        return res.json({ success: true, status: isAlive });    
		    });
		});
	}else {
		return res.json({ success: false, message: "No ip provided" });    
	}

});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes)

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);