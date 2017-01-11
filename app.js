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

	// user's id, defined when the user signs up or logs in.
	var user_id;

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
				db.query(signupquery, function(err, rows, fields) {
					if (!err) {
						// set user_id
						logger("Signup Success: ");
						logger(rows);
						socket.emit('signupsuccess', rows);
					} else {
						// if there was an error signing the user up, forward the error to the client
						logger("Signup Error: Database Error: " + err);
						socket.emit('signuperror', "Database Error: " + err);
					}
				});
			}
		});
	});
});

// functions
function logger(message){ //log to the console and a hard file
	console.log(message);
	fs.appendFile(
		__dirname + "/messages.log", 
		new Date().toUTCString() + "	" + message + "\n", 
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
