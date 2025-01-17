var LogMessage = require("mongoose").model('LogMessage');

const getErrorMessage = function(err){
    var message = '';
    if (err.code) {
        switch(err.code) {
            case 11000:
            case 11001:
                message = 'Time error';
                break;
            default:
                message = 'Unspecified mongodb error';
         }
     } else {
         for (const errName in err.errors){
             if(err.errors[errName].message)
                 message = err.errors[errName].message;
         }
     }
     return message;
};

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
			let emsg = getErrorMessage(err)
			console.log("Error saving log message", lm.message);
			console.log(emsg);
		} else {
			LogMessage.find({},{created:1, message:1, _id:0}).sort({created:-1}).limit(50).exec(function(err, messages){
				if(err){
					let errmsg = "LogMessage.find() failed to return a value. Check database."
					 console.log(errmsg)
					// io.emit('logmessage', errmsg + "\n");
				} else {
					let text = '';
					messages.forEach((message) => {
						let d = new Date(message["created"])
						text += d.toLocaleString('en-US') + ":  " + message["message"] + '\n'
					})
					io.emit('logmessage', text)
				}
			});

		console.log("Res: saved log message", lm.message); 
		}
	});//save
	countDocs()
}

	