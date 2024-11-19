// requiring this module attaches a model to the mongoose object

const mongoose = require('mongoose'); //from node_modules
const Schema = mongoose.Schema;

const LogMessageSchema = new Schema({
    
    created   : {
       type : Date,
       default : Date.now
    },
    message : String,
});

mongoose.model('LogMessage', LogMessageSchema);
