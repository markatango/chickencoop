module.exports = function(app){
    var wcCtrl = require('../controllers/webcontrol.server.controller')();

    app.post('/createwc', wcCtrl.createwc);
    app.get('/openwc', wcCtrl.getlastwc_open);
    app.get('/closewc', wcCtrl.getlastwc_close);
    app.get('/listwc', wcCtrl.getallwc);
    app.get('/getlastwc', wcCtrl.getlastwc);
}
