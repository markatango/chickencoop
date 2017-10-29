const InOut = require('mongoose').model('InOut');
var exec = require('child_process').exec; 
var IOStatusEmitter = require("../js/IOStatusEmitter");


const getErrorMessage = function(err){
    var message = '';
    if (err.code) {
        switch(err.code) {
            case 11000:
            case 11001:
                message = 'Time error';
                break;
            default:
                message = 'Something else';
         }
     } else {
         for (const errName in err.errors){
             if(err.errors[errName].message)
                 message = err.errors[errName].message;
         }
     }
     return message;
};

/* DB model
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
*/

module.exports = function(io) {

    return {

	createio : function(req, res, next){
	    var initialiostate = {
		"ups_state" : false,
		"sts_state" : false,
		"dns_state" : false, 
		"upi_state" : false,
		"sti_state" : false,
		"dni_state" : false,
		"uplim_state" : false,
		"dnlim_state" : false
	    };

		// post from python function

	    var switchstate = req.body.switchstate || initialiostate;

	    console.log("Switchstate: " + JSON.stringify(switchstate));
	    
	    if(switchstate){
		var inout = new InOut();
	    	inout.ups_state = switchstate["ups_state"];
	    	inout.sts_state = switchstate["sts_state"];
	    	inout.dns_state = switchstate["dns_state"];
	    	inout.upi_state = switchstate["upi_state"];
	    	inout.sti_state = switchstate["sti_state"];
	    	inout.dni_state = switchstate["dni_state"];
	    	inout.uplim_state = switchstate["uplim_state"];
	    	inout.dnlim_state = switchstate["dnlim_state"];

          	inout.save(function(err){
	        	if(err){
	    		    return next(err);
	        	} else {
	       	     res.json(inout);
	        	}
	    	});//save

	    } else {
		console.log("inouts.server.controller create: inouts in body are invalid");
            }
	   
    	},// create


	getlastio : function(req, res, next){
	    InOut.find().sort({created : -1}).limit(1).exec(function(err,inout){
		    //var msgj = JSON.parse(inout);
		    console.log("stringified: " + JSON.stringify(inout));
		    IOStatusEmitter(io, inout);
		    res.send(inout);
	    });
	},//getio
	
	getallio : function(req, res, next){
	    InOut.find({}, function(err, inout){
	         if (err) {
	              return next(err);
	         } else {
	              res.json(inout);
	         }
	     });
	}//list	
   }
};