var config = require('./config'),
    http = require('http'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    bodyLogger = require('../app/custom_middleware/body-logger'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    path = require('path'),
    clockEvent = require('../app/js/clockEvent');

module.exports = function(db, cron){ // db is only needed if we activate MongoStore in this file
    var app = express();
    var server = http.createServer(app);
    var io = require('socket.io')(server);

    require('../app/js/initialize_buttons')(io);

    io.on('connection', function(socket){
	  console.log('a user connected');
          clockEvent.immediate(io);
    });

    require('../app/js/startClocker').start(io);
    var cors = require('../app/custom_middleware/cors');

    // set up log to file
    var rfs = require('rotating-file-stream');
    var fs = require('fs');
    var logDirectory = path.join(__dirname, '..', 'log');
    
    
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
    console.log("Log directory: " + logDirectory);

    var accessLogStream = rfs('access.log', {
        interval: '1d',
        path: logDirectory
    });

    app.use(morgan('combined', {stream: accessLogStream}));
    app.use(morgan('dev'));

    app.use(cors);
    
    /*if(process.env.NODE_ENV == 'development'){
	app.use(bodyLogger);
    }*/
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());
   
    require('../app/routes/button.server.routes.js')(app, io);
    require('../app/routes/time.server.routes.js')(app, io, cron);

    app.use(express.static(path.join( __dirname, '../public/assets')));
    app.use(express.static(path.join( __dirname, '../public/views')));
    app.use(express.static(path.join( __dirname, '../bower_components/bootstrap')));
    app.use(express.static(path.join( __dirname, '../bower_components/jquery')));
    app.use(express.static(path.join( __dirname, '../bower_components')));
    app.use(express.static(path.join( __dirname, '../bower_components/bootstrap-material-datetimepicker')));
    
    return server;
}

    