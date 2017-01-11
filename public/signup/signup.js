var socket = io();

// implement client side socket stuff
$(document).on('ready',function(){
	$('.submit').on('click', function(){
		var data = [];
		var children = $('.user-signup-form :input');

		// get data from form into data array
		for (var i = 0; i < children.length; i++)
			data.push($(children[i]).val());

		// do something with the password and send the data to the server
		socket.emit('signup', data);
	});
	socket.on('signuperror', function(err) {
		console.log("Signup error: " + err);
	});
	socket.on('signupsuccess', function(rows){
		console.log("Signup Success! " + rows);
	});
});
