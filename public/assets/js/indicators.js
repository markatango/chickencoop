var socket = io();

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

socket.on('checkUPlim', function(bool){
	$('#ULS').prop('checked', bool);
});

socket.on('checkDNlim', function(bool){
	$('#LLS').prop('checked', bool);
});

socket.on('checkLocalUp', function(b){
	console.log("up checked: ");
	$('#UPS').prop('checked', b);
});

socket.on('checkLocalSt', function(bool){
	$('#STS').prop('checked', bool);
});
socket.on('checkLocalDn', function(bool){
	$('#DNS').prop('checked', bool);
});

socket.on('clockReadout', function(ccTime){
        $('#clock').html(ccTime);
});
