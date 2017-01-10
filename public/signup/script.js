var socket = io();

// implement client side socket stuff

$(document).on('ready',function(){
	$('.user-signup-form > .submit').on('click', function(){
		var data = [];
		var children = $('.user-signup-form').children();
		console.log(children);
	});
});
