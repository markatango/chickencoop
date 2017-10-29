var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function(){

    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
         console.log("Connected to: " + config.db);
    });
    require('../app/models/time.server.model');
    require('../app/models/inout.server.model');
    require('../app/models/webcontrol.server.model');
    return db;
};