$(document).ready(function(){
        
//        $("#open").click(function(){
//            $.post("http://atango.dyndns-server.com:3000/createwc", 
//		{ "wcstate": {"open":true, "close":false}},function(res, status){
//		console.log("open button clicked: " + status);
//	    });
//        });
//
//	$("#close").click(function(){
//            $.post("http://atango.dyndns-server.com:3000/createwc", 
//		{ "wcstate": {"open":false, "close":true}},function(res, status){
//		console.log("close button clicked: " + status);
//	    });
//        });
//

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
		console.log("Updating IO indicators: " + JSON.stringify(res));
	});

	$.get("http://atango.dyndns-server.com:3000/lasttime", function(res){
		console.log("retrieving last time settings");
	});

	//setInterval(updateClock, 1000);
});
