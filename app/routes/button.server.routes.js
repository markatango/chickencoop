
var doStrings = require('../js/doorOpStrings');

module.exports = function(app, io){
    var buttonCtrl = require('../controllers/button.server.controller')(io);

    app.get('/', buttonCtrl.home);
    app.get('/open', buttonCtrl.open);
    app.get('/close', buttonCtrl.close);
    app.get('/report', buttonCtrl.report);
    app.get('/upperlim', buttonCtrl.upperlim);
    app.get('/lowerlim', buttonCtrl.lowerlim);
    app.post('/coopevents', buttonCtrl.coopevents);
    app.get('/initialize',buttonCtrl.initButtons);
    /*app.get('/ntptime', buttonCtrl.ntptime);*/
}
