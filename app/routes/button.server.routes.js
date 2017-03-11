
var doStrings = require('../js/doorOpStrings');


module.exports = function(app, io){
      var buttonCtrl = require('../controllers/button.server.controller')(io);
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

    app.get('/open', buttonCtrl.open);
    app.get('/close', buttonCtrl.close);
    app.get('/report', buttonCtrl.report);
    app.get('/upperlim', buttonCtrl.upperlim);
    app.get('/lowerlim', buttonCtrl.lowerlim);
    app.post('/coopevents', buttonCtrl.coopevents);
    app.get('/initialize',buttonCtrl.initButtons);


    /*app.get('/ntptime', function(req, res){
        var process = spawn('python', ['./py/c.py']);
	process.stdout.on('data', function(data){
	   console.log(`${data}`);
	   res.end(`${data}`);
        });
    });*/
}
