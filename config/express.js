var config = require('./config'),
    http = require('http'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    bodyLogger = require('../app/custom_middleware/body-logger'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    
    path = require('path');

module.exports = function(db){
    var app = express();
    var server = http.createServer(app);
    var io = require('socket.io')(server);

    var cors = require('../app/custom_middleware/cors');
    app.use(morgan('dev'));
    app.use(cors);
    
    /*if(process.env.NODE_ENV == 'development'){
	app.use(bodyLogger);
    }*/
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    
    io.on('connection', function(socket){
	  console.log('a user connected');
	 /* 
	  var spawn = require('child_process').spawn;
	  var process = spawn('python', ['./py/switchWatch.py']);
          process.stdout.on('data', function(data){
                var msg = `${data}`;
		socket.emit('doorprogmsg', "");
		if(msg["UPLIM"] == 1) {
			socket.emit('doorstatemsg', "OPENED");	
		}
		if(msg["DNLIM"] == 1) {
			socket.emit('doorstatemsg', "CLOSED");	
		}
            });
	*/
	});

    require('../app/routes/button.server.routes.js')(app, io);


    app.use(express.static(path.join( __dirname, '../node_modules/socket.io/node_modules/socket.io-client/dist')));
    app.use(express.static(path.join( __dirname, '../public/assets/js')));
    app.use(express.static(path.join( __dirname, '../images')));
    app.use(express.static(path.join( __dirname, '../public/assets/css')));
    app.use(express.static(path.join( __dirname, '../public/views')));
    app.use(express.static(path.join( __dirname, '../bower_components/bootstrap')));
    app.use(express.static(path.join( __dirname, '../bower_components/jquery')));
    app.use(express.static(path.join( __dirname, '../bower_components/moment')));
    app.use(express.static(path.join( __dirname, '../bower_components/bootstrap-material-datetimepicker/js')));
    app.use(express.static(path.join( __dirname, '../bower_components/bootstrap-material-datetimepicker/css')));


    
    return server;
}

    