$('#dooropentime').on('change', function(){
   var stime = $(this).val();
   $.post('/starttime', {
   "startTime" : stime,
   "endTime": $(this).val() }, function(res){
	console.log("Sent: " + stime + "Recvd: " + res);
)});
