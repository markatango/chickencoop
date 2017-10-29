// requiring this module attaches a model to the mongoose object

const mongoose = require('mongoose'); //from node_modules
const Schema = mongoose.Schema;

const WebControlSchema = new Schema({
    
    created   : {
       type : Date,
       default : Date.now
    },
    open : Boolean,
    close : Boolean
});

mongoose.model('WebControl', WebControlSchema);
