// server file 170110
// drew mcarthur
// delivery service

// requirements
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var mysql = require('mysql');
var io = require('socket.io')(http);
var bcrypt = require('bcrypt');

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

// defining socket.io connection
io.on('connection', function(socket){
	
	logger("Connection established: ");
	logger("    " + socket);

	// user's id, defined when the user signs up or logs in.
	var user_id = 0;

	// communications for user signup
	socket.on('signup', function(data){
		bcrypt.hash(data[1], saltRounds, function(err, hash) {
			if (err) {
				logger("Error hashing password: " + err); socket.emit('signuperror', "Error hashing password: " + err);
			} else {
				data[1] = hash;

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
						user_id = rows.insertId;
						logger("Signup Success: ");
						logger(rows.insertId);
						socket.emit('signupsuccess', rows.insertId);
					} else {
						// if there was an error signing the user up, forward the error to the client
						logger("Signup Error: Database Error: " + err);
						socket.emit('signuperror', "Database Error: " + err);
					}
				});
			}
		});
	});
	socket.on('login', function(data){
		var q = "SELECT id,password FROM user WHERE email='" + data[0] + "';";
		db.query(q, function(err, rows){
			if (err) {
				logger("Login Error: ");
				logger("    " + err);
				socket.emit("loginerror", err.toString());
			} else if (rows.length == 0) {
				// no email exists
				logger("Login Error: Invalid Email");
				socket.emit('loginerror', 'invalidcredentials');
			} else { 
				var hash = rows[0].password;
				var id = rows[0].id;
				bcrypt.compare(data[1], hash, function(err, res){
					if (err) {
						logger("Login Error: ");
						logger("    " + err);
						socket.emit('loginerror', err.toString());
					} else if (!res) {
						logger("Login Error: Incorrect Password");
						socket.emit('loginerror', "invalidcredentials");
					} else {
						logger("User " + id + " logged in.");
						user_id = id;
						socket.emit('loginsuccess', id);
					}
				});
			}
		});
	});
	socket.on('logout', function() {
		logger("User " + id + " logged out.");
		user_id = 0;
		socket.emit('logoutsuccess');
	});
	socket.on('disconnect', function() {
		logger("User " + id + " disconnected.");
	});
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
 
// routes
/* don't think i need this because i can just put another index inside /public/signup/ for the same effect
app.get("/signup", function(req,res){
	res.render("/public/signup.html");
});
*/

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
