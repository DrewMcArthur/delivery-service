$(document).on('ready', function(){
	var signupData = [];
	$(document).on('click', '.login-form.container button.login-btn', function(){
		$.ajax({
			type: "POST",
			url: '/login',
			data: $('.page1 .form-login').serialize(),
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
		var pass2 = "<label class='pass2' for='pass2'>confirm password</label><input style='display:none' class='form-control password pass2' type='password' name='pass2'></input>"

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

	$(document).on('click', '.page1 button.next-btn', function(){
	/* * * * * * * * * * * * * * * * * * * * * * * * * 
	 *  Input Error Checking on Sign Up (First page) *
	 * * * * * * * * * * * * * * * * * * * * * * * * */
		// Error: Bad Email
		if (!$('input.email').val().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
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
		if ($('input.pass1').val().length < 5) {
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

		if ($('input.pass1').val() != $('input.pass2').val()) {
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

		signupData.update($('.page1 form.form-login').serializeArray()
													.filter(function(item){
			return item.name != 'pass2';
		}));
		
		$('.signup-form.page1').hide('slide', {direction: 'left'}, 200, 
			function() {
				$('.signup-form.page2').show('slide', {direction: 'right'}, 200);
				$('input.name').select();
			});


		// TODO
		//		room number option, delivery warning (in yellow?) venmo notice
		//	unhide fourth page
		//		summary of person's details, everything getting submitted
		//		serialize form1 + serialize form2? 
		//		then parse and display (have to seriliaze it all together anyways to submit)
		//		submit button with post to /signup
	});

	/* * * * * * * * * * * * * * * *
	 * Page 2 (Name, Phone Number) *
	 * * * * * * * * * * * * * * * */
	$(document).on('click', '.page2 button.back-btn', function(){
		$('input.email').select();
		// hide page 2, show page 1
		$('.signup-form.page2').hide('slide', {direction: 'right'}, 200, 
			function() {
				$('.signup-form.page1').show('slide', {direction: 'left'}, 200);
			});
	});
	$(document).on('click', '.page2 button.next-btn', function(){
		// ensure name not blank
		if ($('input.name').val().length == 0){
			// Error: Name Field Empty
			var errormess = "<p class='has-error errmsg name'>Name is required, please try again.</p>";
			if ($('p.name.errmsg').length == 0)
				$('input.name').after(errormess);
			$('p.name.errmsg').slideDown(70);
			$('.name').select();
			setTimeout(function(){
				$('input.name').effect('bounce', 'slow');
			}, 100);
			return false;
		} else {
			$('.errmsg.name').slideUp(70, function(){
				$('.errmsg.name').remove();
			});
		}
		// error check on phone number
		$('input.phone').val($('input.phone').val().replace(/\D/g, ""));
		var len = $('input.phone').val().length;
		if ( len != 10 && len != 11 && len != 0) {
			// Error: Bad Phone Number
			var errormess = "<p class='has-error errmsg phone'>Invalid phone number, please try again.</p>";
			if ($('p.phone.errmsg').length == 0)
				$('input.phone').after(errormess);
			$('p.phone.errmsg').slideDown(70);
			$('.phone').select();
			setTimeout(function(){
				$('input.phone').effect('bounce', 'slow');
			}, 100);
			return false;
		} else {
			$('.errmsg.pass-match').slideUp(70, function(){
				$('.errmsg.pass-match').remove();
			});
		}
		
		$('.errmsg').remove();

		// add new data to singupData
		signupData.update($('.page2 form.form-login').serializeArray());

		populateConfirmation(signupData);

		// hide page 2, show page 3
		$('.signup-form.page2').hide('slide', {direction: 'left'}, 200, 
			function() {
				$('.signup-form.page3').show('slide', {direction: 'right'}, 200);
				$('input.none').select();
			});
	});

	/* * * * * * * * * * * * *
	 * Page 3 (Confirmation) *
	 * * * * * * * * * * * * */
	$(document).on('click', '.page3 button.back-btn', function(){
		// hide page 2, show page 1
		$('.signup-form.page3').hide('slide', {direction: 'right'}, 200, 
			function() {
				$('.signup-form.page2').show('slide', {direction: 'left'}, 200);
			});
	});
	$(document).on('click', '.page3 button.submit-btn', function(){
		$.ajax({
			type: "POST",
			url: '/signup',
			data: $('.page3 form.form-login').serialize(),
			success: function() {
				window.location.replace('/home');
			}
		});
		// prevent new page from loading
		return false;
	});
	$(document).on('click', '.page3 form.form-login', function(){
		$('.page3 p.help').effect('bounce', 'slow');
	});

	var populateConfirmation = function(data){
		for (var i = 0; i < data.length; i++){
			if(data[i].value.length > 0) {
				$('.page3 .'+data[i].name).val(data[i].value);
				$('.page3 .'+data[i].name).show();
			} else
				$('.page3 .'+data[i].name).hide();
		}
		$('.page3 .pass2').remove();
	}

	// phone help text fading
	$('input.phone').on('focusin', function(){
		$('span.for-phone.help').css('opacity', '1');
	});
	$('input.phone').on('focusout', function(){
		$('span.for-phone.help').css('opacity', '.25');
	});
	// room help text fading
	$('input.room').on('focusin', function(){
		$('span.for-room.help').css('opacity', '1');
	});
	$('input.room').on('focusout', function(){
		$('span.for-room.help').css('opacity', '.25');
	});

	// array.update(array2)
	//		adds elements of array2 to array, and updates elements of 
	//		array if they already exist.
	Array.prototype.update = function(array){
		for(var i = 0; i < array.length; i++){
			var oldEl = this.find(function(element){
				return element.name == array[i].name;
			});
			if (oldEl)
				oldEl.value = array[i].value
			else
				this.push(array[i]);
		}
	}
});
