// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var fs 			= require('fs');


var config  	=  {name:"defaultName"};

var file_path 	= 'data.json';
 
if (fs.existsSync(file_path)){
	config = JSON.parse(fs.readFileSync(file_path, "utf8"));
	console.log("Fichier de configuration chargé");	
}else{
	console.log("Aucun fichier de configuration.");
	console.log("Création du fichier de configuration...");
	save();
}


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

apiRoutes.get('/config/', function (req,res){
	return res.send(config);
});

apiRoutes.put('/config/:name',function(req,res){
	var name = req.params.name;

	if (name){
		config.name = name;
		save();
		return res.json({ success: true, message: "Serveur renommé avec succès." }); 

	}else{
		return res.status(400).json({message :"No name provided."});
	}

});

apiRoutes.put('/config/red/:r/green/:g/blue/:b',function(req, res){
	var r = req.params.r;
	var g = req.params.g;
	var b = req.params.b;

	if(r && g && b){

		var colors = {
			red : r,
			green : g, 
			blue : b,
		};

		config["colors"] = colors;
		save();
		return res.send(true); //FIXME

	}else{
		return res.status(400).json({message : "GPIO manquant."});
	}
});


apiRoutes.get('/lights/:r/:g/:b',function (req, res){
	console.log(config);
	if (!config.colors || !config.colors.red || !config.colors.green || !config.colors.blue){
		// TODO SEND COMMAND
		return res.status(500).json("Problème de configuration, un des GPIOS est mal renseigné.");
	}else{

		return res.json({sucess : true});
	}
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes)

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);


function save(){
	fs.writeFileSync(file_path,JSON.stringify(config));
}









