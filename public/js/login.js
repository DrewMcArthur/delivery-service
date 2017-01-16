$(document).on('ready', function(){
	$('.form-signin').on('submit',function(){
		$.ajax({
			type: "POST",
			url: '/login',
			data: $('.form-signin').serialize(),
			success: function(res) {
				if (res == 'error')
					wrongPassword();
				else
					window.location.replace('/');
			}
		});
	
		// prevent new page from loading
		return false;
	});
});

var wrongPassword = function(){
	var errormess = "<p class='has-error errmsg'>Invalid login, please try again.</p>";
	if ($('p.errmsg').length == 0)
		$('input.password').after(errormess);
	$('input.password').effect('bounce', 'slow');
	$('input.password').select();
}
