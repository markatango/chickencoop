$(document).ready(function(){
        
        $("#open").click(function(){
            $.get("http://atango.dyndns-server.com:3000/open", function(res){
		console.log("open button clicked");
		if(res === 'opened'){
			$('#openInd').html("OPENED");
                }
	    });
        });

	$("#close").click(function(){
            $.get("http://atango.dyndns-server.com:3000/close", function(res){
		console.log("close button clicked");
		if(res === 'closed'){
			$('#openInd').html("CLOSED");
                }
	    });
        });

       $("#report").click(function(){
            $.get("http://atango.dyndns-server.com:3000/report", function(res){
		console.log("report button clicked");
		$('#reportshow').html(res);
	    });
        }); 

	setInterval(updateClock, 1000);

});
