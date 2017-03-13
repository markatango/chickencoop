module.exports = function(app, io){
    var timeCtrl = require('../controllers/times.server.controller')(io);

    app.post('/times', timeCtrl.create); 
    app.get('/lasttime', timeCtrl.lasttime);
}
