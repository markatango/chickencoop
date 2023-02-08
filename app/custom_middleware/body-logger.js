module.exports = function(req, res, next){
	if (req) {
		console.log('req.body found: ' + JSON.stringify(req.body));
	} else {
		console.log('req body: body not found.')
	}
	
	next();
}