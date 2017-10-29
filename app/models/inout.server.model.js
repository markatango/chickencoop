// requiring this module attaches a model to the mongoose object

const mongoose = require('mongoose'); //from node_modules
const Schema = mongoose.Schema;

const InOutSchema = new Schema({
    
    created   : {
       type : Date,
       default : Date.now
    },
    ups_state : Boolean,
    sts_state : Boolean,
    dns_state : Boolean,
    upi_state : Boolean,
    sti_state : Boolean,
    dni_state : Boolean,
    uplim_state : Boolean,
    dnlim_state : Boolean
});

mongoose.model('InOut', InOutSchema);
