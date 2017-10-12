var socket = io();

var colorDot = function(on_bool, b_id) {
    if(on_bool){
	   $(b_id).removeClass('none')
		   .addClass('dot-red');
    } else {
	   $(b_id).removeClass('dot-red')
		   .addClass('none');
    };
};

socket.on('doorstatemsg', function(msg){
	$('#doorStateMsg').text(msg);
});

socket.on('doorprogmsg', function(msg){
	$('#doorProgress').text(msg);
});

socket.on('dooroptime', function(msg){
	$('#doorOpTime').text(msg);
});

socket.on('timelog', function(msg){
	$('#timeLog').text(msg);
});

socket.on('dooropentime', function(msg){
	$('#dooropentime').val(msg);
});

socket.on('doorclosetime', function(msg){
	$('#doorclosetime').val(msg);
});

socket.on('clockReadout', function(ccTime){
        $('#clock').html(ccTime);
});

socket.on('checkUPlim', function(b){
	colorDot(b, '#ULS');
});

socket.on('checkDNlim', function(b){
	colorDot(b, '#LLS');
});

socket.on('checkLocalUp', function(b){
	colorDot(b, '#UPS');
});

socket.on('checkLocalSt', function(b){
	colorDot(b, '#STS');
});

socket.on('checkLocalDn', function(b){
	colorDot(b, '#DNS');
});

socket.on('checkLocalInUp', function(b){
	colorDot(b, '#UPI');
});

socket.on('checkLocalInSt', function(b){
	colorDot(b, '#STI');
});

socket.on('checkLocalInDn', function(b){
	colorDot(b, '#DNI');
});


