const  doStrings = require("./doorOpStrings");
var displayLogger = require("../js/displayLogger");



module.exports = function(io, msgj){

	var publishMessage = function(message){
		console.log(message);
		displayLogger(io, message);
	}

	if(msgj["UPS"] == 1) {
		let message = "Local up switch pushed: " + msgj["UPS"]
		publishMessage(message)
		io.emit('checkLocalUp', true);
	} else {
		io.emit('checkLocalUp', false);
	};

	if(msgj["STS"] == 1) {
		let message = "Local stop switch pushed: " + msgj["STS"]
		publishMessage(message)
		io.emit('checkLocalSt', true);
	} else {
		io.emit('checkLocalSt', false);
	};

	if(msgj["DNS"] == 1) {
		let message = "Local down switch pushed: "+ msgj["DNS"]
		publishMessage(message)
		io.emit('checkLocalDn', true);
	} else {
		io.emit('checkLocalDn', false);
	};

	if(msgj["UPLIM"] == 1) {
		let message = "Upper limit reached: " + msgj["UPLIM"]
		publishMessage(message)
		io.emit('doorstatemsg', doStrings.doorOps.UPLIM.doorStateMsg);
		io.emit('checkUPlim', true);
		io.emit('checkDNlim', false);
	
	} else if(msgj["DNLIM"] == 1) {
		let message = "Lower limit reached: " + msgj["DNLIM"]
		publishMessage(message)
	 	io.emit('doorstatemsg', doStrings.doorOps.DNLIM.doorStateMsg);	
		io.emit('checkUPlim', false);
		io.emit('checkDNlim', true);
	
	} else {
		let message = "Door in the middle: " + msgj["DNLIM"]
		publishMessage(message)
		io.emit('doorstatemsg', doStrings.doorOps.MID.doorStateMsg);
		io.emit('checkUPlim', false);
		io.emit('checkDNlim', false);
	};
	
	if(msgj["UPI"] == 1) {
		let message = "UP input to door controller: " + msgj["UPI"]
		publishMessage(message)
		io.emit('checkLocalInUp', true);
	} else {
		io.emit('checkLocalInUp', false);
	};

	if(msgj["STI"] == 1) {
		let message = "STOP input to door controller: " + msgj["STI"]
		publishMessage(message)
		io.emit('checkLocalInSt', true);
	} else {
		io.emit('checkLocalSt', false);
	};

	if(msgj["DNI"] == 1) {
		let message = "DOWN input to door controller: " + msgj["DNI"]
		publishMessage(message)
		io.emit('checkLocalInDn', true);
	} else {
		io.emit('checkLocalInDn', false);
	};
}