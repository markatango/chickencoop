const Time = require('mongoose').model('Time');

const getErrorMessage = function(err){
    var message = '';
    if (err.code) {
        switch(err.code) {
            case 11000:
            case 11001:
                message = 'Time error';
                break;
            default:
                message = 'Something else';
         }
     } else {
         for (const errName in err.errors){
             if(err.errors[errName].message)
                 message = err.errors[errName].message;
         }
     }
     return message;
};

const timeStringToDate = function(timeString){
	return "1970-01-01T" + timeString + ":00Z";
};

module.exports = function(io) {

    return {

	create : function(req, res, next){
	
	    var starttime = timeStringToDate(req.body.startTime);
	    var endtime = timeStringToDate(req.body.endTime);
	    console.log("Start time: " + starttime);
	    console.log("End time: " + endtime);
	
	    var time = new Time();
	    time.startTime = starttime;
	    time.endTime = endtime;
	    time.save(function(err){
	        if(err){
	    	    return next(err);
	        } else {
	            res.json(time);
	        }
	    });
	
	    io.emit('doorstatemsg', doStrings.doorOps.UP.doorStateMsg);
	    io.emit('doorprogmsg', doStrings.doorOps.UP.doorProgMsg);
	    io.emit('dooroptime', doStrings.doorOps.UP.doorOpTime);
	    io.emit('timelog', time);
	    io.emit('dooropentime', req.body.startTime);
	    io.emit('doorclosetime', req.body.endTime);
	},
	
	list : function(req, res, next){
	    Time.find({}, function(err, time){
	         if (err) {
	              return next(err);
	         } else {
	              res.json(time);
	         }
	     });
	}	
   }
};

