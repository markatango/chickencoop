const Time = require('mongoose').model('Time');
const spawn = require('child_process').spawn;
const path = require('path');
const doStrings = require('../js/doorOpStrings');
const Stopwatch = require('node-stopwatch').Stopwatch;
var IOStatusEmitter = require("../js/IOStatusEmitter");

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
  const motorActionScriptPath = path.join(__dirname, '../..', 'py/motorAction.py');
  const timerAScriptPath = path.join(__dirname, '../..', 'py/a.py');
  const timerBScriptPath = path.join(__dirname, '../..', 'py/b.py');
  const timerCScriptPath = path.join(__dirname, '../..', 'py/c.py');
  const helloScriptPath = path.join(__dirname, '../..', 'py/hello.py');
  const coopSwitchesWithEventsScriptPath = path.join(__dirname, '../..', 'py/coopSwitchesWithEvents.py');

    return {

	home : function(req, res){
	          var filename = path.join(__dirname, '../..', 'public/views/index.html'); 
      		  res.sendFile(filename, function(err){
                      if(err){
                         console.log("home error: " + err);
                         res.status(err.status).end();
                      } else {
                         console.log('Sent: ' + filename);
			res.end();
		      }
                  });
    	},
	
	open : function(req, res){
	//spawns a python script with __name__ == '__main__'
	    
	    var process = spawn('python', [motorActionScriptPath, JSON.stringify(doStrings.doorOps.UP.door_op)]);
	    var resp = ''
            process.stdout.on('data', function(data){
                var msg = "Door open command: " + `${data}`;
		console.log(msg);
	        resp += data
            });
            process.stderr.on('data', function(data){
		console.log("open error: " + `${data}`);
	        resp += data
	    });
            res.end(resp)



//	    var timer = spawn('python', [timerAScriptPath]);
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
//			console.log("timer error: " + `${data}`);
//               	res.end(data);
//	    });
	},

	close : function(req, res){
  
	    var process = spawn('python', [motorActionScriptPath, JSON.stringify(doStrings.doorOps.DOWN.door_op)]);
	    var resp = ''
            process.stdout.on('data', function(data){
                var msg = "Door close command: " + `${data}`;
		console.log(msg);
	        resp += data
            });
	    process.stderr.on('data', function(data){
		console.log("close error: " + `${data}`);
 	        resp += data
	    });
            res.end(resp)

//	    var timer = spawn('python', [timerAScriptPath])
	    
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
            var process = spawn('python', [helloScriptPath]);
	    
            process.stdout.on('data', function(data){
                console.log(`${data}`);
                res.end(data);
                });
	    process.stderr.on('data', function(data){
		console.log("report error: " + `${data}`);
                res.end(data);
	    });

        },

	upperlim : function(req, res){
		console.log("Upper limit reached");
		res.end('upperlim');

//		var timer = spawn('python', [timerBScriptPath])
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
		
     },
	
	coopevents : function(req, res){
	    //var elapsed = {'seconds' : '0', 'milliseconds' : 0};
	    //var stopwatch = Stopwatch.create();

	    var msg = req.body.query;
	    console.log("Coop event (in coopevents): " + msg);

	    //io.emit('doorstatemsg', msg);
	    //io.emit('doorprogmsg', "sponges");
	    //io.emit('checkLocalUp', true);
	    var msgj = JSON.parse(msg);
	    console.log("stringified: " + JSON.stringify(msgj));
	    IOStatusEmitter(io, msgj);
	    res.end("coopevents.res: " + req.body.query);
      },
	
	startdoorcontrol : function(req, res){
	   var spawn = require('child_process').spawn;
	   
	   var process = spawn('python', [coopSwitchesWithEventsScriptPath]);
	   process.stdout.on('data', function(data){
	        var msg = `${data}`;
		console.log("startdoorcontrol: Switch status: " + msg);
		res.end("Switch status: " + msg);
		io.emit('doorprogmsg', "");
		var msgj = JSON.parse(msg);
		IOStatusEmitter(io, msgj);
		
	   }); //process.stdout.on
	
	   process.stderr.on('data', function(data){
		console.log("startdoorcontrol error: " + `${data}`);
	        res.end(data);
	   });
	    
	},

	ntptime : function(req, res){
	        var process = spawn('python', [timerCScriptPath]);
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

