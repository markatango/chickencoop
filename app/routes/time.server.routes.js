module.exports = function(app, io, cron){
    var timeCtrl = require('../controllers/times.server.controller')(io, cron);

    app.post('/times', timeCtrl.create); 
    app.get('/lasttime', timeCtrl.lasttime);
}
