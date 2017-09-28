const Time = require('mongoose').model('Time');
const spawn = require('child_process').spawn;
const path = require('path');
const doStrings = require('../js/doorOpStrings');
const Stopwatch = require('node-stopwatch').Stopwatch;



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

module.exports = function(io) {
  
    return {

	home : function(req, res){
	          var filename = path.join(__dirname, '../..', 'public/views/index.html'); 
      		  res.sendFile(filename, function(err){
                      if(err){
                         console.log(err);
                         res.status(err.status).end();
                      } else {
                         console.log('Sent: ' + filename);
		      }
                  });
    	},
	
	open : function(req, res){
	
           
  
	//spawns a python script with __name__ == '__main__'
	    var process = spawn('python', ['./py/motorAction.py', JSON.stringify(doStrings.doorOps.UP.door_op)]);
            process.stdout.on('data', function(data){
                var msg = "Door command: " + `${data}`;
		console.log(msg);
            });
            process.stderr.on('data', function(data){
		console.log(`${data}`);
                res.end(data);
	    });

	    
//	    var timer = spawn('python', ['./py/a.py']);
//	    
//	    timer.stdout.on('data', function(data){
//		var timerres = `${data}`
//		var msg = "Door movement start time: " + timerres;
//		console.log(msg);
//		res.end(msg);
//		
//		io.emit('doorstatemsg', doStrings.doorOps.UP.doorStateMsg);
//		io.emit('doorprogmsg', doStrings.doorOps.UP.doorProgMsg);
//		io.emit('dooroptime', doStrings.doorOps.UP.doorOpTime);
//	        io.emit('timelog', timerres);	
//	    });
//	    timer.stderr.on('data', function(data){
//			console.log(`${data}`);
//               	res.end(data);
//	    });
	},

	close : function(req, res){
  
	    var process = spawn('python', ['./py/motorAction.py', JSON.stringify(doStrings.doorOps.DOWN.door_op)]);
            process.stdout.on('data', function(data){
                var msg = "Door close command: " + `${data}`;
		console.log(msg);
            });
	    process.stderr.on('data', function(data){
		console.log(`${data}`);
                res.end(data);
	    });
//	    var timer = spawn('python', ['./py/a.py'])
	    
//	    timer.stdout.on('data', function(data){
//		var timerres = `${data}`
//		var msg = "Door movement start time: " + timerres;
//		console.log(msg);
//		res.end(msg);
//		
//		io.emit('doorstatemsg', doStrings.doorOps.DOWN.doorStateMsg);
//		io.emit('doorprogmsg', doStrings.doorOps.DOWN.doorProgMsg);
//		io.emit('dooroptime', doStrings.doorOps.DOWN.doorOpTime);
//	        io.emit('timelog', timerres);	
//	    });
//          timer.stderr.on('data', function(data){
//			console.log(`${data}`);
//              	res.end(data);
//	    });
        },

	report : function(req, res){
            var process = spawn('python', ['./py/hello.py']);
	    
            process.stdout.on('data', function(data){
                console.log(`${data}`);
                res.end(data);
                });
	    process.stderr.on('data', function(data){
		console.log(`${data}`);
                res.end(data);
	    });

        },

//	upperlim : function(req, res){
//		console.log("Upper limit reached");
//		res.end('upperlim');
//	
//		var timer = spawn('python', ['./py/b.py'])
//		
//		timer.stdout.on('data', function(data){
//			var timerres = `${data}`
//			var msg = "Door movement time interval: " + timerres;
//			console.log(msg);
//			res.end(msg);
//			
//			io.emit('doorstatemsg', doStrings.doorOps.UPLIM.doorStateMsg);
//			io.emit('doorprogmsg', doStrings.doorOps.UPLIM.doorProgMsg);
//			io.emit('dooroptime', timerres);
//			io.emit('timelog', timerres);
//	        });
//		timer.stderr.on('data', function(data){
//			console.log(`${data}`);
  //              	res.end(data);
//	        });
		
//     },

//	lowerlim : function(req, res){
//		console.log("Lower limit reached");
//		res.end('lowerlim');
//	
//		var timer = spawn('python', ['./py/b.py'])
//		
//		timer.stdout.on('data', function(data){
//			var timerres = `${data}`
//			var msg = "Door movement time interval: " + timerres;
//			console.log(msg);
//			res.end(msg);
//			
//			io.emit('doorstatemsg', doStrings.doorOps.DNLIM.doorStateMsg);
//			io.emit('doorprogmsg', doStrings.doorOps.DNLIM.doorProgMsg);
//			io.emit('dooroptime', timerres);
//			io.emit('timelog', timerres);
//		});
//                timer.stderr.on('data', function(data){
//			console.log(`${data}`);
//              	res.end(data);
//		});
//       }, 
	
	coopevents : function(req, res){
     		var elapsed = {'seconds' : '0', 'milliseconds' : 0};
		var stopwatch = Stopwatch.create();

		var msg = req.body.query;
		console.log("Coop event (in coopevents): " + msg);
	
		//io.emit('doorstatemsg', msg);
		//io.emit('doorprogmsg', "sponges");
		//io.emit('checkLocalUp', true);
		var msgj = JSON.parse(msg);
		console.log("stringified: " + JSON.stringify(msgj));

		if(msgj["UPS"] == 1) {
			stopwatch.start();
			console.log("Local up switch pushed: " + msgj["UPS"]);
			io.emit('checkLocalUp', true);
			stopwatch.stop();
			stopwatch.reset();
		} else {
			io.emit('checkLocalUp', false);
		}
		if(msgj["STS"] == 1) {
			console.log("Local stop switch pushed: " + msgj["STS"]);
			io.emit('checkLocalSt', true);
		} else {
			io.emit('checkLocalSt', false);
		}
		if(msgj["DNS"] == 1) {
			stopwatch.start();
			console.log("Local down switch pushed: "+ msgj["DNS"]);
			io.emit('checkLocalDn', true);
			stopwatch.stop();
			stopwatch.reset();
		} else {
			io.emit('checkLocalDn', false);
		}
		if(msgj["UPLIM"] == 1) {
			
			elapsed["milliseconds"] = stopwatch.elapsedMilliseconds;
			elapsed["seconds"] = stopwatch.elapsedSeconds;
			stopwatch.stop();

			io.emit('dooroptime', JSON.stringify(elapsed["milliseconds"]/1000));
			io.emit('timelog', elapsed);
			io.emit('doorstatemsg', doStrings.doorOps.UPLIM.doorStateMsg);
			io.emit('checkUPlim', true);
			io.emit('checkDNlim', false);
		} else if(msgj["DNLIM"] == 1) {
			elapsed["milliseconds"] = stopwatch.elapsedMilliseconds;
			elapsed["seconds"] = stopwatch.elapsedSeconds;
			stopwatch.stop();

			io.emit('dooroptime', JSON.stringify(elapsed["milliseconds"]/1000));
			io.emit('timelog', elapsed);
		 	io.emit('doorstatemsg', doStrings.doorOps.DNLIM.doorStateMsg);	
			io.emit('checkUPlim', false);
			io.emit('checkDNlim', true);
		} else {
			io.emit('doorstatemsg', doStrings.doorOps.MID.doorStateMsg);
			io.emit('checkUPlim', false);
			io.emit('checkDNlim', false);
		}
	
	        res.end("coopevents.res: " + req.body.query);
      },
	
	readButtons : function(req, res){
	   var spawn = require('child_process').spawn;
	   
	   var process = spawn('python', ['./py/coopSwitchesWithEvents.py']);
	   process.stdout.on('data', function(data){
	        var msg = `${data}`;
		console.log("Switch status: " + msg);
		res.end("Switch status: " + msg);

		io.emit('doorprogmsg', "");

		var msgj = JSON.parse(msg);
		if(msgj["UPLIM"] == 1) {
			console.log('msgj["UPLIM"] == 1');
			io.emit('doorstatemsg', doStrings.doorOps.UPLIM.doorStateMsg);
			io.emit('checkUPlim', true);
		} else if(msgj["DNLIM"] == 1) {
			console.log('msgj["DNLIM"] == 1');
		 	io.emit('doorstatemsg', doStrings.doorOps.DNLIM.doorStateMsg);	
			io.emit('checkDNlim', true);
		} else {
			console.log('msgj["DNLIM"] == 0 and msgj["UPLIM"] == 0');
			io.emit('doorstatemsg', doStrings.doorOps.MID.doorStateMsg);
		}
		if(msgj["UPS"] == 1) {
			console.log("Local up switch pushed");
			io.emit('checkLocalUp', true);
		} else {
			io.emit('checkLocalUp', false);
		}
		if(msgj["STS"] == 1) {
			console.log("Local stop switch pushed");
			io.emit('checkLocalSt', true);
		} else {
			io.emit('checkLocalSt', false);

		}
		if(msgj["DNS"] == 1) {
			console.log("Local down switch pushed");
			io.emit('checkLocalDn', true);
		} else {
			io.emit('checkLocalDn', false);
		}


	   }); //process.stdout.on	
	   process.stderr.on('data', function(data){
		console.log(`${data}`);
  
              res.end(data);
	    });
	},

	ntptime : function(req, res){
	        var process = spawn('python', ['./py/c.py']);
		process.stdout.on('data', function(data){
		   console.log(`${data}`);
		   res.end(`${data}`);
	        });
    	},
	test : function(req,res){
		console.log("in test");
		res.end("test ended");
	}


    }; // return
};

