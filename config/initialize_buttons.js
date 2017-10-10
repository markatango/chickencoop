
const spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(io){
   console.log("initializing buttons");
   var coopSwitchesWithEventsScriptPath = path.join(__dirname, '../', 'py/coopSwitchesWithEvents.py');

   var process = spawn('python', [coopSwitchesWithEventsScriptPath,'initialize']);

   
   process.stdout.on('data', function(data){
        var msg = `${data}`;
	console.log("Switch status: " + `${data}`);
	//res.end("Switch status: " + `${data}`);

	io.emit('doorprogmsg', "");
	
	if(msg["UPLIM"] == 1) {
		io.emit('doorstatemsg', doStrings.doorOps.UPLIM.doorStateMsg);
		io.emit('checkUPlim', true);
	} else if(msg["DNLIM"] == 1) {
	 	io.emit('doorstatemsg', doStrings.doorOps.DNLIM.doorStateMsg);	
		io.emit('checkDNlim', true);
	} else {
		io.emit('doorstatemsg', doStrings.doorOps.MID.doorStateMsg);
	}
	if(msg["UPS"] == 1) {
		console.log("Local up switch pushed");
		io.emit('checkLocalUp', true);
	} else {
		io.emit('checkLocalUp', false);
	}
	if(msg["STS"] == 1) {
		console.log("Local stop switch pushed");
		io.emit('checkLocalSt', true);
	} else {
		io.emit('checkLocalSt', false);
	}
	if(msg["DNS"] == 1) {
		console.log("Local down switch pushed");
		io.emit('checkLocalDn', true);
	} else {
		io.emit('checkLocalDn', false);
	}


   }); //process.stdout.on	
   process.stderr.on('data', function(data){
	console.log(`${data}`);
       
	    });
};
    