$.fn.exists = function(){
	return $(this).length > 0;
}

$(document).ready(function(){

    var context;
     if ( $('#gameScreen').exists() ){
		context = $('#gameScreen').get(0).getContext('2d');
	} else {
		$("#gameScreen").before("<h1>Que Carajo, tu explorador web no soporta HTML5, seguro usas IE</h1>");
	}

});