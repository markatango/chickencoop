
doStrings = require('../../js/doorOpStrings');

module.exports = function(app, io){
      var spawn = require('child_process').spawn;
      var path = require('path');
      
      app.get('/', function(req, res){
      var filename = path.join(__dirname, '../..', 'public/views/index.html');
        
      res.sendFile(filename, function(err){
                if(err){
                    console.log(err);
                    res.status(err.status).end();
                } else {
                    console.log('Sent: ' + filename);
		}
            });
    });

    app.get('/open', function(req, res){
	//spawns a python script with __name__ == '__main__'
	    var process = spawn('python', ['./py/motorAction.py', JSON.stringify(doStrings.doorOps.UP.door_op)]);
            process.stdout.on('data', function(data){
                var msg = "Door command: " + `${data}`;
		console.log(msg);
            });
	    var timer = spawn('python', ['./py/a.py'])
	    
	    timer.stdout.on('data', function(data){
		var timerres = `${data}`
		var msg = "Door movement start time: " + timerres;
		console.log(msg);
		res.end(msg);
		
		io.emit('doorstatemsg', doStrings.doorOps.UP.doorStateMsg);
		io.emit('doorprogmsg', doStrings.doorOps.UP.doorProgMsg);
		io.emit('dooroptime', doStrings.doorOps.UP.doorOpTime);
	        io.emit('timelog', timerres);	
	    });
    });

    app.get('/close', function(req, res){
	    var process = spawn('python', ['./py/motorAction.py', JSON.stringify(doStrings.doorOps.DOWN.door_op)]);
            process.stdout.on('data', function(data){
                var msg = "Door command: " + `${data}`;
		console.log(msg);
            });
	    var timer = spawn('python', ['./py/a.py'])
	    
	    timer.stdout.on('data', function(data){
		var timerres = `${data}`
		var msg = "Door movement start time: " + timerres;
		console.log(msg);
		res.end(msg);
		
		io.emit('doorstatemsg', doStrings.doorOps.DOWN.doorStateMsg);
		io.emit('doorprogmsg', doStrings.doorOps.DOWN.doorProgMsg);
		io.emit('dooroptime', doStrings.doorOps.DOWN.doorOpTime);
	        io.emit('timelog', timerres);	
	    });
    });

    app.get('/report', function(req, res){
            var process = spawn('python', ['./py/hello.py']);
	    
            process.stdout.on('data', function(data){
                console.log(`${data}`);
                res.end(data);
                });
    });

    app.get('/upperlim', function(req, res){
	console.log("Upper limit reached");
	res.end('upperlim');

	var timer = spawn('python', ['./py/b.py'])
	
	timer.stdout.on('data', function(data){
		var timerres = `${data}`
		var msg = "Door movement time interval: " + timerres;
		console.log(msg);
		res.end(msg);
		
		io.emit('doorstatemsg', doStrings.doorOps.UPLIM.doorStateMsg);
		io.emit('doorprogmsg', doStrings.doorOps.UPLIM.doorProgMsg);
		io.emit('dooroptime', timerres);
		io.emit('timelog', timerres);
	});
    });

    app.get('/lowerlim', function(req, res){
	console.log("Lower limit reached");
	res.end('lowerlim');

	var timer = spawn('python', ['./py/b.py'])
	
	timer.stdout.on('data', function(data){
		var timerres = `${data}`
		var msg = "Door movement time interval: " + timerres;
		console.log(msg);
		res.end(msg);
		
		io.emit('doorstatemsg', doStrings.doorOps.DNLIM.doorStateMsg);
		io.emit('doorprogmsg', doStrings.doorOps.DNLIM.doorProgMsg);
		io.emit('dooroptime', timerres);
		io.emit('timelog', timerres);
	});
    });

    app.post('/coopEvents', function(req, res){
     
	msg = req.body.query;
	console.log("Coop event: " + msg);

	io.emit('doorstatemsg', msg);
	io.emit('doorprogmsg', "sponges");

        res.end("Coop event: " + req.body.query);
    });

	app.get('/initialize', function(req, res){
	  var spawn = require('child_process').spawn;
	  var process = spawn('python', ['./py/switchWatch.py']);
	  process.stdout.on('data', function(data){
	        var msg = JSON.parse(`${data}`);
		//console.log("Switch status: " + `${data}`);
		//console.log("Specifically, msg['UPLIM'] = " + msg["UPLIM"]);
		res.end("Switch status: " + `${data}`);

		io.emit('doorprogmsg', "");
		
		if(msg["UPLIM"] == 1) {
			io.emit('doorstatemsg', doStrings.doorOps.UPLIM.doorStateMsg);	
		} else if(msg["DNLIM"] == 1) {
			io.emit('doorstatemsg', doStrings.doorOps.DNLIM.doorStateMsg);	
		} else {
			io.emit('doorstatemsg', doStrings.doorOps.MID.doorStateMsg);
		}
	  });
	
	});

    /*app.get('/ntptime', function(req, res){
        var process = spawn('python', ['./py/c.py']);
	process.stdout.on('data', function(data){
	   console.log(`${data}`);
	   res.end(`${data}`);
        });
    });*/
}
