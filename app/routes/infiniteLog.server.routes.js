module.exports = function(app){

    var infLogCtrl = require('../controllers/infiniteLog.server.controller')();

    app.get('/documents', infLogCtrl.getNext);
}


