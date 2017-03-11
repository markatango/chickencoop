
var Time = require('mongoose').model('Time');

doStrings = require('../js/doorOpStrings');

module.exports = function(app, io){
    var timeCtrl = require('../controllers/times.server.controller')(io);

    app.post('/times', timeCtrl.create); 

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

	

    /*app.get('/ntptime', function(req, res){
        var process = spawn('python', ['./py/c.py']);
	process.stdout.on('data', function(data){
	   console.log(`${data}`);
	   res.end(`${data}`);
        });
    });*/
}
