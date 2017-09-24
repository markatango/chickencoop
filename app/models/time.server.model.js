// requiring this module attaches a model to the mongoose object

const mongoose = require('mongoose'); //from node_modules
const Schema = mongoose.Schema;

const TimeSchema = new Schema({
    startTime : Date,
    endTime   : Date,
    created   : {
       type : Date,
       default : Date.now
    }
    
});

mongoose.model('Time', TimeSchema);
