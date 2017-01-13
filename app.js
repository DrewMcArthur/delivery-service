// server file 170110
// drew mcarthur
// delivery service

// requirements
var fs = require('fs');
var express = require('express');
var app = express();
var session = require('express-session');
var http = require('http').Server(app);
var mysql = require('mysql');
var io = require('socket.io')(http);
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');

// sql connection info
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'deliveryapp'
});
handleDisconnect(db);

app.use(session({
  secret: 'keyboard doggo pupper',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // change this once i get HTTPS running
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// middleware
var authUser = function(req, res, next) {
	// if they're trying to log in, go ahead
	if (req.url.match(/\/[(login)(info)].*/))
		// but if they're already logged in, boot them to the homepage
		if (req.session.user_id)
			return res.redirect('/');
		else 
			return next();
	// anywhere they try to go, if they aren't logged in,
	if (!req.session.user_id)
		// send them to the login page
		return res.redirect('/login');
	else
		return next();
}

app.use(authUser);

//this hosts the files located in the ./public directory
app.use(express.static(__dirname + '/public'));

// variables
const saltRounds = 5;

// communications for user signup
app.post('/signup', function(req, res){
	var data = req.body;
	bcrypt.hash(data.password, saltRounds, function(err, hash) {
		if (err) {
			logger("Error hashing password: " + err); 
			res.status(500).send(err);
		} else {
			data.password = hash;

			// sql query to add user with [data] to user table
			var signupquery = "INSERT INTO user(username, password, email, phone, room) VALUES (";
			for (var i in data) {
				signupquery += "'" + data[i] + "'";
				signupquery += (i == data.length - 1 ? ");" : ", ");
			}

			logger("Adding new user to database with query: ");
			logger("	" + signupquery);
			// add user to user table with [data]
			db.query(signupquery, function(err, rows) {
				if (!err) {
					// set user_id
					req.session.user_id = rows.insertId;
					logger("Signup Success: ");
					logger(rows.insertId);
					res.redirect('/');
				} else {
					// if there was an error signing the user up, forward the error to the client
					logger("Signup Error: Database Error: " + err);
					res.status(500).send(err);
				}
			});
		}
	});
});
app.post('/login', function(req, res){
	var email = req.body.email;
	var pass = req.body.password;
	// get hashed password from database
	var q = "SELECT id,password FROM user WHERE email='" + email + "';";
	db.query(q, function(err, rows){
		if (err) {
			logger("Login Error: ");
			logger("    " + err);
			res.status(500).send(err);
		} else if (rows.length == 0) {
			// no email exists
			logger("Login Error: Invalid Email");
			res.redirect('/login?error=credentials');
		} else { 
			var hash = rows[0].password;
			var id = rows[0].id;
			// check if thats the right password
			bcrypt.compare(pass, hash, function(err, success){
				if (err) {
					logger("Login Error: ");
					logger("    " + err);
					res.status(500).send(err);
				} else if (!success) {
					logger("Login Error: Incorrect Password");
					res.redirect('/login?error=credentials');
				} else {
					logger("User " + id + " logged in.");
					req.session.user_id = id;
					res.redirect('/');
				}
			});
		}
	});
});

app.get('/logout', function(req, res) {
	logger("User " + req.session.user_id + " logged out.");
	req.session.user_id = null;
	res.redirect('/');
});

//listen for requests at localhost:80
http.listen(80, function(){ 
    //callback function, completely optional.   
    logger("Server is running on port 80");      
});

process.on( 'SIGINT', function() {
	logger( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
	db.end();
	process.exit( );
});

// functions
function logger(message){ //log to the console and a hard file
	console.log(message);
	fs.appendFile(
		__dirname + "/messages.log", 
		new Date().toUTCString() + "	" + message.toString() + "\n", 
		function(err){ 
			if(err) { console.log(err); } 
		}
	);
}
function handleDisconnect(db){
	// The server is either down or restarting (takes a while sometimes).
	db.connect(function(err) {              
		if(err) {                                     
			logger(serverMessage('error when connecting to db:'+ err));
			// We introduce a delay before attempting to reconnect,
			setTimeout(handleDisconnect, 2000); 
			// to avoid a hot loop, and to allow our node script to
		}                                     
	// process asynchronous requests in the meantime.
	});                                     
	// If you're also serving http, display a 503 error.
	db.on('error', function(err) {
		logger(serverMessage('db error', err));
		// Connection to the MySQL server is usually
		if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
			// lost due to either server restart, or a
			handleDisconnect();                         
		// connnection idle timeout (the wait_timeout server variable configures this)
		} else {                                      
			throw err;                                  
		}
	});
}
