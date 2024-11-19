var LogMessage = require("mongoose").model('LogMessage');

async function countDocs(query = {}) {
	try {
	  const count = await LogMessage.count(query);
	  console.log('Document count:', count);
	} catch (error) {
	  console.error('Error counting documents:', error);
	}
  }
  
module.exports = function(io, msg){
	var lm = new LogMessage();
	lm.message = msg;
	lm.save(function(err){
		if(err){
		console.log("Error saving log message", lm.message);
		} else {
		console.log("Res: saved log message", lm.message); 
		}
	});//save
	countDocs()
	LogMessage.find({},{created:1, _id:0}).sort({created:-1}).limit(1).exec(function(err,cdate){
		if(err){
			let errmsg = "Log message.find() failed to return value. Check database."
 			console.log(errmsg)
			io.emit('logmessage', errmsg + "\n");
		} else {
			io.emit('logmessage', "last log message saved at: " + cdate)
			io.emit('logmessage', msg)
		}
	})
}

	