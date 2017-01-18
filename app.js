var express = require('express');
var morgan = require('morgan');
var bodyparser = require('body-parser');
var path = require('path');
var app = express();

require('./routes/button.server.routes.js')(app);

app.use(express.static(path.join( __dirname, 'js')));
app.use(express.static(path.join( __dirname, 'images')));
app.use(express.static(path.join( __dirname, 'css')));
app.use(express.static(path.join( __dirname, '/public/views')));


app.listen(3000, function(){
	console.log('Listening on port 3000...');
});

