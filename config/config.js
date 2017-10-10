var path = require('path');
var envPath = path.join(__dirname + '/env/');
//console.log(envPath + process.env.NODE_ENV + '.js');
module.exports = require(envPath + process.env.NODE_ENV + '.js');