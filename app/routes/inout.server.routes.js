module.exports = function(app){
    var ioCtrl = require('../controllers/inouts.server.controller')();

    app.post('/inout', ioCtrl.createio);
    app.get('/inout', ioCtrl.getlastio);
    app.get('/listinout', ioCtrl.getallio);
}
