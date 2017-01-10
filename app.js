// server file 170110
// drew mcarthur
// delivery service

var express = require('express');
var app = express();

//this hosts the files located in the ./public directory
app.use(express.static(__dirname + '/public'));

//listen for requests at localhost:80
app.listen(80, function(){ 
    //callback function, completely optional.   
    console.log("Server is running on port 80");      
});
