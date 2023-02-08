$(document).ready(function(){

	// move host and port from hardcode to environment variable
	// need proxy?
        
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
	})

    $.get("http://atango.dyndns-server.com:3000/lasttime", function(res){
		console.log("retrieving last time settings");
	});
});

// 230207-MGR
function print_nav_timing_data() {
  // Use getEntriesByType() to just get the "navigation" events
  var perfEntries = performance.getEntriesByType("navigation");

  for (var i=0; i < perfEntries.length; i++) {
    console.log("= Navigation entry[" + i + "]");
    var p = perfEntries[i];
    // dom Properties
    console.log("DOM content loaded = " + (p.domContentLoadedEventEnd - p.domContentLoadedEventStart));
    console.log("DOM complete = " + p.domComplete);
    console.log("DOM interactive = " + p.interactive);
 
    // document load and unload time
    console.log("document load = " + (p.loadEventEnd - p.loadEventStart));
    console.log("document unload = " + (p.unloadEventEnd - p.unloadEventStart));
    
    // other properties
    console.log("type = " + p.type);
    console.log("redirectCount = " + p.redirectCount);
  }
}

print_nav_timing_data();


