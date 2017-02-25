module.exports = function (req, res, next) {

    // custom middleware; note use of next() to ensure middleware chain does not hang
    res.header("Access-Control-Allow-Origin", "*"); // allow requests from anywhere
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next(); //this is custom middleware
}