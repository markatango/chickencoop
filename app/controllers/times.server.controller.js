const Time = require('mongoose').model('Time');
const doStrings = require('../js/doorOpStrings');
var exec = require('child_process').exec; 

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
	return "1970-01-01 " + timeString + ":00";
};


const _getMinutes = function(date){
	var mins = date.getMinutes();
	if(mins <10) mins = "0" + mins;
	return mins;
};

const _getHours = function(date){
	var hrs = date.getHours();
	if(hrs <10) hrs = "0" + hrs;
	return hrs;
};

const killOpenCronJob = function(cJob){
	if(cJob != null){
		cJob.stop();
		cJob.destroy();
	}
};


const makeCronString = function (date){
    return date.getMinutes() + " " +  date.getHours() + " *" + " *" + " *";
};

const dateStringTotime = function(dateString){
	var dt = new Date(dateString);
	return _getHours(dt) + ":" + _getMinutes(dt);
};

var cronJobOpen = null;
var cronJobClose = null;

module.exports = function(io, cron) {

    return {

	create : function(req, res, next){
	    var lasttime;
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
	    });//save
	    

	killOpenCronJob(cronJobOpen);
	killOpenCronJob(cronJobClose);

	Time.find().sort({created : -1}).limit(1).exec(function(err,time){
		var cronString = makeCronString(time[0].startTime);
                console.log(time[0]);
		console.log('open cronString: ' + cronString);
		cronJobOpen = cron.schedule(cronString, function(){
			console.log("scheduled open");
			var child = exec('/usr/bin/wget http://localhost:3000/open', function(err, stdout, stderr){
                            if(err !== null){
                                console.log("error: " + err);
                             } else {
                                console.log("open succeeded!");
                             }
                         });
                });

		cronJobOpen.start();

		cronString = makeCronString(time[0].endTime);
		console.log('close cronString: ' + cronString);
		cronJobClose = cron.schedule(cronString, function(){
			console.log("scheduled close");
			var child = exec('/usr/bin/wget http://localhost:3000/open', function(err, stdout, stderr){
                            if(err !== null){
                                console.log("error: " + err);
                             } else {
                                console.log("close succeeded!");
                             }
                        });//exec
	        });//schedule
               cronJobClose.start();
	    });//db find and execute
	
            /* should be managed by /open /close endpoings
	    io.emit('doorstatemsg', doStrings.doorOps.UP.doorStateMsg);
	    io.emit('doorprogmsg', doStrings.doorOps.UP.doorProgMsg);
	    io.emit('dooroptime', doStrings.doorOps.UP.doorOpTime);
	    io.emit('timelog', time);
            */

            //update the open close time displays
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