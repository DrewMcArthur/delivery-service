$(document).on('ready', function(){

/* trying to get label change color on focus
	$('input').on('focus', function(){
		$("label[for='"+ $(this).attr('name') +"']").css('color', '#91C4ED');
	}, function() {
		$("label[for='"+ $(this).attr('name') +"']").css('color', 'darkgray');
	});
*/
	$(document).on('click', '.login-form.container button.login-btn', function(){
		console.log('sending in ajax post thing now, we just clicked login');
		$.ajax({
			type: "POST",
			url: '/login',
			data: $('.form-login').serialize(),
			success: function(res) {
				if (res == 'error') {
					var errormess = "<p class='has-error errmsg pass'>Invalid login, please try again.</p>";
					if ($('p.pass.errmsg').length == 0)
						$('input.password').after(errormess);
					$('.errmsg').slideDown(70);
					$('input.password').effect('bounce', 'slow');
					$('input.password').select();
				} else
					window.location.replace('/');
			}
		});
		// prevent new page from loading
		return false;
	});

	$(document).on('click', 'button.signup-btn', function(){
		var pass2 = "<label for='pass2'>confirm password</label><input style='display:none' class='form-control password pass2' type='password' name='pass2'></input>"

		$('.errmsg').slideUp('fast', function(){
			$('.errmsg').remove();
		});

		$('input.password').addClass('pass1');
		$('input.pass1').after(pass2);
		$('input.pass2').slideDown('fast');

		$('.login-btn').addClass('cancel-btn');
		$('.login-btn').removeClass('login-btn');
		$('button.cancel-btn').html('Cancel');

		$('.signup-btn').addClass('next-btn');
		$('.signup-btn').removeClass('signup-btn');
		$('button.next-btn').html('Next');
	});

	$(document).on('click', 'button.cancel-btn', function() {
		$('.errmsg').slideUp('fast', function(){
			$('.errmsg').remove();
		});
		$('input.pass2').slideUp('fast', function(){
			$('input.pass2').remove();
		});
		$('label[for="pass2"]').slideUp('fast', function(){
			$('label[for="pass2"]').remove();
		});

		$('.cancel-btn').addClass('login-btn');
		$('.cancel-btn').removeClass('cancel-btn');
		$('button.login-btn').html('Log In');

		$('.next-btn').addClass('signup-btn');
		$('.next-btn').removeClass('next-btn');
		$('button.signup-btn').html('Sign Up');
	});

	$(document).on('click', 'button.next-btn', function(){
	/* * * * * * * * * * * * * * * * * * * * * * * * * 
	 *  Input Error Checking on Sign Up (First page) *
	 * * * * * * * * * * * * * * * * * * * * * * * * */
		// Error: Bad Email
		if (!$('.email').val().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
			var errormess = "<p class='has-error errmsg email'>Invalid Email.</p>";
			if ($('p.email.errmsg').length == 0)
				$('input.email').after(errormess);
			$('.errmsg').slideDown(70);
			$('.email').select();
			setTimeout(function(){
				$('input.email').effect('bounce', 'slow');
			}, 100);
			return false;
		} else {
			$('.errmsg.email').slideUp(70, function(){
				$('.errmsg.email').remove();
			});
		}

		// Error: No password
		if ($('.pass1').val().length < 5) {
			var errormess = "<p class='has-error errmsg pass'>Invalid password, please try again.</p>";
			if ($('p.pass.errmsg').length == 0)
				$('input.pass1').after(errormess);
			$('.pass.errmsg').slideDown(70);
			$('input.pass1').select();
			setTimeout(function(){
				$('input.pass1').effect('bounce', 'slow');
			}, 100);
			return false;
		} else {
			$('.errmsg.pass').slideUp(70, function(){
				$('.errmsg.pass').remove();
			});
		}

		if ($('.pass1').val() != $('.pass2').val()) {
			// Error: Mismatched Passwords
			var errormess = "<p class='has-error errmsg pass-match'>Mismatched Passwords, please try again.</p>";
			if ($('p.pass-match.errmsg').length == 0)
				$('input.pass2').after(errormess);
			$('.errmsg').slideDown(70);
			$('.pass2').select();
			setTimeout(function(){
				$('input.password').effect('bounce', 'slow');
			}, 100);
			return false;
		} else {
			$('.errmsg.pass-match').slideUp(70, function(){
				$('.errmsg.pass-match').remove();
			});
		}

	/* * * * * * * * * * * * *
	 * Moving to Second Page *
	 * * * * * * * * * * * * */
		// TODO
		//	Unhide second page (slide current out and next in)
		//		has name and phone number
		//		label with sentence under phone saying
		//			"Entering your number is optional, but facilitates communication."
		//		error checking on phone number
		//	unhide third page
		//		room number option, delivery warning (in yellow?) venmo notice
		//	unhide fourth page
		//		summary of person's details, everything getting submitted
		//		serialize form1 + serialize form2? 
		//		then parse and display (have to seriliaze it all together anyways to submit)
		//		submit button with post to /signup
	});
});
