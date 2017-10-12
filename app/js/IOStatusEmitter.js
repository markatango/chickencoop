const  doStrings = require("./doorOpStrings");

module.exports = function(io, msgj){

	if(msgj["UPS"] == 1) {
		console.log("Local up switch pushed: " + msgj["UPS"]);
		io.emit('checkLocalUp', true);
	} else {
		io.emit('checkLocalUp', false);
	};

	if(msgj["STS"] == 1) {
		console.log("Local stop switch pushed: " + msgj["STS"]);
		io.emit('checkLocalSt', true);
	} else {
		io.emit('checkLocalSt', false);
	};

	if(msgj["DNS"] == 1) {
		console.log("Local down switch pushed: "+ msgj["DNS"]);
		io.emit('checkLocalDn', true);
	} else {
		io.emit('checkLocalDn', false);
	};

	if(msgj["UPLIM"] == 1) {
		console.log("Upper limit reached: " + msgj["UPLIM"]);
		io.emit('doorstatemsg', doStrings.doorOps.UPLIM.doorStateMsg);
		io.emit('checkUPlim', true);
		io.emit('checkDNlim', false);
	
	} else if(msgj["DNLIM"] == 1) {
		console.log("Lower limit reached: " + msgj["DNLIM"]);
	 	io.emit('doorstatemsg', doStrings.doorOps.DNLIM.doorStateMsg);	
		io.emit('checkUPlim', false);
		io.emit('checkDNlim', true);
	
	} else {
		console.log("Door in the middle: " + msgj["DNLIM"]);
		io.emit('doorstatemsg', doStrings.doorOps.MID.doorStateMsg);
		io.emit('checkUPlim', false);
		io.emit('checkDNlim', false);
	};
	
	if(msgj["UPI"] == 1) {
		console.log("UP input to door controller: " + msgj["UPI"]);
		io.emit('checkLocalInUp', true);
	} else {
		io.emit('checkLocalInUp', false);
	};

	if(msgj["STI"] == 1) {
		console.log("STOP input to door controller: " + msgj["STI"]);
		io.emit('checkLocalInSt', true);
	} else {
		io.emit('checkLocalSt', false);
	};

	if(msgj["DNI"] == 1) {
		console.log("DOWN input to door controller: " + msgj["DNI"]);
		io.emit('checkLocalInDn', true);
	} else {
		io.emit('checkLocalInDn', false);
	};
}