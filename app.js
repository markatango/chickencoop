var express = require('express');
var morgan = require('morgan');
var bodyparser = require('body-parser');
var path = require('path');
var spawn = require('child_process').spawn;



var app = express();


app.use(express.static(path.join( __dirname, 'js')));
app.use(express.static(path.join( __dirname, 'css')));
app.use(express.static(path.join( __dirname, '/public/views')));

app.get('/', function(req,res){
	res.sendFile('index.html');
});

app.get('/open', function(req,res){
	console.log("in /open");
	res.end('opened');
});

app.get('/close', function(req,res){
	console.log("in /close");
	res.end('closed');
});

app.get('/report', function(req,res){
	var process = spawn('python', ['./services/hello.py']);
	process.stdout.on('data', function(data){
            console.log(data);
            res.end(data);
            });
});


app.listen(3000, function(){
	console.log('Listening on port 3000...');
});

