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
	return "1970-01-01 " + timeString + ":00Z";
};

const dateStringTotime = function(dateString){
	var dt = new Date(dateString);
	var hrs = dt.getHours();
	if(hrs <10) hrs = "0" + hrs;
	var mins = dt.getMinutes();
	if(mins <10) mins = "0" + mins;
	return hrs + ":" + mins;
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

	lasttime : function(req, res, next){
		Time.find().sort({created : -1}).limit(1).exec(function(err,time){
			res.send(time);
			io.emit('dooropentime', dateStringTotime(time[0].startTime));
	    		io.emit('doorclosetime', dateStringTotime(time[0].endTime));
		});
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

