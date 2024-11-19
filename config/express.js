// var config = require('./config'),
var http = require('http'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    bodyLogger = require('../app/custom_middleware/body-logger'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    path = require('path'),
    clockEvent = require('../app/js/clockEvent'),
    initializeButtons = require('../app/js/initialize_buttons'),
    clockStarter = require('../app/js/startClocker'),
    rfs = require('rotating-file-stream'),
    fs = require('fs'),
    cors = require('../app/custom_middleware/cors');


module.exports = function(db, cron){ // db is only needed if we activate MongoStore in this file
  var app = express();
  var server = http.createServer(app);
  var io = require('socket.io')(server);


  io.on('connection', function(socket){
  console.log('a user connected');
        clockEvent.immediate(io);
//        initializeButtons(io);
  });

  clockStarter.start(io);
// set up access log to file
  var logDirectory = path.join(__dirname, '..', 'log');
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
  console.log("Log directory: " + logDirectory);
  var accessLogStream = rfs('access.log', {
     interval: '1d',
     size: "10M",
     path: logDirectory
  });

  app.use(morgan(':date[iso], :remote-addr, :method, :status, :res[content-length]', 
			{stream : accessLogStream}));

  app.use(cors);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());
/*  if(process.env.NODE_ENV == 'development'){
    app.use(bodyLogger);
  }
*/
/*  app.use((req, res) => {
    console.log("req.body: ");
    console.log(req.body); // this is what you want           
    res.on("finish", () => {
      console.log("res:" );
      console.log(res);
    });
  });
 */
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

    
