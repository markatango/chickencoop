
var doStrings = require('../js/doorOpStrings');

module.exports = function(app, io){
    var buttonCtrl = require('../controllers/button.server.controller')(io);

    app.get('/', buttonCtrl.home);
    app.get('/open', buttonCtrl.open);
    app.get('/close', buttonCtrl.close);
    app.get('/report', buttonCtrl.report);
    app.post('/coopevents', buttonCtrl.coopevents);
    app.get('/updateio',buttonCtrl.updateio);
    app.get('/test',buttonCtrl.test);
}
