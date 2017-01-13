$(document).on('ready', function(){
	if(getUrlParameter('error')){
		var errormess = "<p class='errmsg'>Invalid login, please try again.</p>";
		$('input.password').after(errormess);
		$('.errmsg').show();
	}
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
