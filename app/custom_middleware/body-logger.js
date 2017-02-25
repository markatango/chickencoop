module.exports = function(req, res, next){
	console.log('req.body: ' + JSON.stringify(req.body));
	next();
}