var socket = io();

// implement client side socket stuff
$(document).on('ready',function(){
	$('.submit').on('click', function(){
		var data = [];
		var children = $('.user-signup-form :input');

		// get data from form into data array
		for (var i = 0; i < children.length; i++)
			data.push($(children[i]).val());

		// make sure this stuff is good
		if (validate_user_data(data))
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

var validate_user_data = function(input) {
	var name = input[0];
	var pass = input[1];
	var email = input[2];
	var phone = input[3];
	var room = input[4];

	for (var i in input) {
		input[i] = input[i].replace("'","").replace('"',"");
	}

	phone = phone.replace(/\D/g,"");
	if (phone.length == 11)
		phone = phone.substr(1);
	if (phone.length != 10)
		return input_error('.user-signup-form .phone');

	return true;
}

var input_error = function(el) {
	// make element red, display error message
	$(el).addClass(":invalid");
	$(el + ".errmsg").show();
	return false;
}
