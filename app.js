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

// variables
const saltRounds = 5;

// sql connection info
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'deliveryapp'
});
db.connect();

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
	logger("User " + id + " logged out.");
	req.session.user_id = 0;
	res.redirect('/');
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
 
//this hosts the files located in the ./public directory
app.use(express.static(__dirname + '/public'));

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
