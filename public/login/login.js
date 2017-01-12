var socket = io();

// implement client side socket stuff
$(document).on('ready',function(){
	$('.submit').on('click', function(){
		var data = [];
		var children = $('.user-login-form :input');

		// get data from form into data array
		for (var i = 0; i < children.length; i++)
			data.push($(children[i]).val());

		// make sure this stuff is good
		if (validate_user_data(data))
			$('.errmsg').hide();
			// do something with the password and send the data to the server
			socket.emit('login', data);
	});
	socket.on('loginerror', function(err) {
		console.log("Login error: " + err);
		var errormess = "<p class='errmsg'>Invalid login, please try again.</p>";
		$('input.password').after(errormess);
	});
	socket.on('loginsuccess', function(rows){
		console.log("Login Success! " + rows.toString());
	});
});

var validate_user_data = function(input) {
	var email = input[0];
	var pass = input[1];

	for (var i in input) {
		input[i] = input[i].replace("'","").replace('"',"");
	}
	
	if (email.indexOf("@") < 1) {
		console.log("invalid email");
		input_error('.user-login-form .email');
		return false;
	}

	return true;
}

var input_error = function(el) {
	// make element red, display error message
	$(el).addClass("invalid");
	$(el + ".errmsg").show();
	return false;
}
