/*$('#dooropentime').on('change', function(){
   var stime = $(this).val();
   $.post('/starttime', 
	{ "startTime" : stime,
   	   "endTime"  : stime 
	}, 
	function(res){
		console.log("Sent: " + stime + "Recvd: " + res);
	}
)});

$('#doorclosetime').on('change', function(){
   var stime = $(this).val();
   $.post('/endtime', 
	{ "startTime" : stime,
   	   "endTime"  : stime 
	}, 
	function(res){
		console.log("Sent: " + stime + "Recvd: " + res);
	}
)});
*/

$('#timesform').on('submit', function(e){
var data = $(this);
 	e.preventDefault();
       $.post('/times',data.serialize(), function(res){
       console.log("Posted time data from submit button: " + JSON.stringify(res));
});
});

