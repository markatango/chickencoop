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