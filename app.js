process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_SERVER_PORT = process.env.NODE_SERVER_PORT || 3000;

var mongoose = require('./config/mongoose');
    express  = require('./config/express');

var db  = mongoose();
var app = express(db);

app.listen(process.env.NODE_SERVER_PORT);

console.log('Listening on port ' + process.env.NODE_SERVER_PORT + '...');


