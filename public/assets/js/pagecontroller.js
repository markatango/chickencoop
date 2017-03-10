$(document).ready(function(){

	//$('#dooropentime').bootstrapMaterialDatePicker({date:false, format:'HH:mm'});

	//$('#doorclosetime').bootstrapMaterialDatePicker({date:false, format:'HH:mm'});
        
        $("#open").click(function(){
            $.get("http://atango.dyndns-server.com:3000/open", function(res){
		console.log("open button clicked");
	    });
        });

	$("#close").click(function(){
            $.get("http://atango.dyndns-server.com:3000/close", function(res){
		console.log("close button clicked");
	    });
        });

	$("[name*='switches']").on('change', function(){
		console.log($("[name*='switches']:checked").val());
		switch($("[name*='switches']:checked").val()){
			case 'ULS':
				endpoint = 'upperlim';
				break;
			case 'LLS':
				endpoint = 'lowerlim';
				break;
			default:
				endpoint = '';
		}

            $.get("http://atango.dyndns-server.com:3000/" + endpoint, function(res){
		console.log(endpoint + " switch closed");
	    });
        });


       $("#report").click(function(){
            $.get("http://atango.dyndns-server.com:3000/report", function(res){
		console.log("report button clicked");
		$('#reportshow').html(res);
	    });
        }); 
	
	$.get("http://atango.dyndns-server.com:3000/initialize", function(res){
		console.log("initializing...");
	});

	setInterval(updateClock, 1000);
});
