$(document).ready(function(){
        
        $("#open").click(function(){
            $.get("http://atango.dyndns-server.com:3000/open",function(res){
		console.log("open button clicked: ");
	    });
        });

	$("#close").click(function(){
            $.get("http://atango.dyndns-server.com:3000/close",function(res){
		console.log("close button clicked: ");
	    });
        });

       $("#report").click(function(){
            $.get("http://atango.dyndns-server.com:3000/report", function(res){
		console.log("report button clicked");
		$('#reportshow').html(res);
	    });
        }); 
	
	$.get("http://atango.dyndns-server.com:3000/updateio", function(res){
		console.log("Updating IO indicators");
	});

	$.get("http://atango.dyndns-server.com:3000/lasttime", function(res){
		console.log("retrieving last time settings");
	});

	//setInterval(updateClock, 1000);
});
