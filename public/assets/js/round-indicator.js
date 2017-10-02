var chanignExample = function(color) {
    $('#exampleDot').removeClass('dot-red')
                    .removeClass('dot-yellow')
                    .removeClass('dot-green')
                    .removeClass('none')
                    .addClass(color);

	console.log("changed to " + color);
	};

$('#button-off').on('click', function(){chanignExample('none')});
$('#button-red').on('click', function(){chanignExample('dot-red')});
$('#button-yellow').on('click', function(){chanignExample('dot-yellow')});
$('#button-green').on('click', function(){chanignExample('dot-green')});