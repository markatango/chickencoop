process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_SERVER_PORT = process.env.NODE_SERVER_PORT || 3000;

var mongoose = require('./config/mongoose'),
    cron = require('node-cron'),
    express  = require('./config/express');


var db  = mongoose();
var app = express(db, cron);

app.listen(process.env.NODE_SERVER_PORT, function(){
   console.log('Listening on port ' + process.env.NODE_SERVER_PORT + '...');
});

module.exports = app;



