process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_SERVER_PORT = process.env.NODE_SERVER_PORT || 3000;

var mongoose = require('./config/mongoose'),
    cron = require('node-cron');
    
var db  = mongoose();
var express  = require('./config/express');
var app = express(db, cron);
var path = require('path');
var morgan = require('morgan');

app.listen(process.env.NODE_SERVER_PORT, function(){
   console.log('Listening on port ' + process.env.NODE_SERVER_PORT + '...');
});

module.exports = app;



