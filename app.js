// server file 170110
// drew mcarthur
// delivery service

// requirements
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
				console.log("Error hashing password: " + err);
				socket.emit('signuperror', "Error hashing password: " + err);
			} else {
				data[1] = hash;

				// sql query to add user with [data] to user table
				var signupquery = "INSERT INTO user(username, password, email, phone, room) VALUES (";
				for (var i in data) {
					signupquery += "'" + data[i] + "'";
					signupquery += (i == data.length - 1 ? ");" : ", ");
				}

				console.log("Adding new user to database with query: ");
				console.log("	" + signupquery);
				// add user to user table with [data]
				db.query(signupquery, function(err, rows, fields) {
					if (!err) {
						// set user_id
						console.log("signup success, printing rows then fields");
						console.log(rows);
						console.log(fields);
						socket.emit('signupsuccess');
					} else {
						// if there was an error signing the user up, forward the error to the client
						console.log("Signup Error: Database Error: " + err);
						socket.emit('signuperror', "Database Error: " + err);
					}
				});
			}
		});
	});
});
 
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
    console.log("Server is running on port 80");      
});

process.on( 'SIGINT', function() {
	console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
	db.end();
	process.exit( );
});
