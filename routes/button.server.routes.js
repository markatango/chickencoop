var spawn = require('child_process').spawn;
var path = require('path');

module.exports = function(app){

    app.get('/', function(req, res){
        var filename = path.join(__dirname, '..', 'public/views/index.html');
        
        res.sendFile(filename, function(err){
                if(err){
                    console.log(err);
                    res.status(err.status).end();
                } else {
                    console.log('Sent: ' + filename);
                }
            });
    });

    app.get('/open', function(req, res){
            console.log("in /open");
            res.end('opened');
    });

    app.get('/close', function(req, res){
            console.log("in /close");
            res.end('closed');
    });

    app.get('/report', function(req, res){
            var process = spawn('python', ['./services/hello.py']);
            process.stdout.on('data', function(data){
                console.log(data);
                res.end(data);
                });
    });

}
