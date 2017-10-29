const spawn = require('child_process').spawn;
var IOStatusEmitter = require("./IOStatusEmitter");
var path = require('path');

module.exports = function(io){
   console.log("initializing buttons");
   var coopSwitchesWithEventsScriptPath = path.join(__dirname, '../..', 'py/coopSwitchesWithEvents.py');

   var process = spawn('python', [coopSwitchesWithEventsScriptPath,'initialize']);

   process.stdout.on('data', function(data){
        var msg = `${data}`;
	console.log("Initialize_buttons switch status: " + `${data}`);

	io.emit('doorprogmsg', "");
	IOStatusEmitter(io, msg);
   }); 

   process.stderr.on('data', function(data){
	console.log("initialize_buttons error: " + `${data}`);
   });
};
    