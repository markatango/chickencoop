var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function(){
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    console.log("Attempting to connect to mongo database");
 
    mongoose.connect(config.db);
/* Ready states being:

0: disconnected
1: connected
2: connecting
3: disconnecting */
    console.log("mongoose readyState:");
    console.log(mongoose.connection.readyState);
/*    while(mongoose.connection.readyState != 1){
       console.log("waiting for Mongo")
    }; */
    var db = mongoose.connection;
    console.log(db)
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
         console.log("Connected to: " + config.db);
    });
    require('../app/models/time.server.model');
    require('../app/models/inout.server.model');
    require('../app/models/webcontrol.server.model');
    require('../app/models/log.server.model');
    return db;
};
