// server file 170110
// drew mcarthur
// delivery service

var express = require('express');
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'deliveryapp'
});
 
connection.connect();
 
/*
connection.query('SELECT * from < table name >', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});
*/
 


//this hosts the files located in the ./public directory
app.use(express.static(__dirname + '/public'));

//listen for requests at localhost:80
app.listen(80, function(){ 
    //callback function, completely optional.   
    console.log("Server is running on port 80");      
});

connection.end();
