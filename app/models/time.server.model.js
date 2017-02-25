const mongoose = require('mongoose');
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
