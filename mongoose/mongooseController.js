module.exports = function(){

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chickencoop');
var db = mongoose.connection;
db.on('connected', function(){
	console.log("Connected to MongoDB");
});
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("Connected to mongodb");
});

return mongoose;

}