$(document).on('ready', function(){
	$('.form-signin').on('submit',function(){
		$.ajax({
		  type: "POST",
		  url: '/login',
		  data: $('.form-signin').serialize(),
		});
	});
});
/*
				var errormess = "<p class='has-error'>Invalid login, please try again.</p>";
				$('input.password').after(errormess);
				$('input.password').focus();
*/
