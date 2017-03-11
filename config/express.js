var config = require('./config'),
    http = require('http'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    bodyLogger = require('../app/custom_middleware/body-logger'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    
    path = require('path');

module.exports = function(db){ // db is only needed if we activate MongoStore in this file
    var app = express();
    var server = http.createServer(app);
    var io = require('socket.io')(server);

    var cors = require('../app/custom_middleware/cors');
    app.use(morgan('dev'));
    app.use(cors);
    
    /*if(process.env.NODE_ENV == 'development'){
	app.use(bodyLogger);
    }*/
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    
    io.on('connection', function(socket){
	  console.log('a user connected');
     });

    require('../app/routes/button.server.routes.js')(app, io);
    require('../app/routes/time.server.routes.js')(app, io);

    app.use(express.static(path.join( __dirname, '../public/assets')));
    app.use(express.static(path.join( __dirname, '../public/views')));
    app.use(express.static(path.join( __dirname, '../bower_components/bootstrap')));
    app.use(express.static(path.join( __dirname, '../bower_components/jquery')));
    app.use(express.static(path.join( __dirname, '../bower_components')));
    app.use(express.static(path.join( __dirname, '../bower_components/bootstrap-material-datetimepicker')));
    
    return server;
}

    