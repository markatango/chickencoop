const Time = require('mongoose').model('Time');

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


exports.create = function(req, res, next){
    var time = new Time(req.body);
    time.save(function(err) {
        if(err) {
           return next(err);
        } else {
           res.json(time);
        }
     });
};

exports.list = function(req, res, next){
    Time.find({}, function(err, times){
         if (err) {
              return next(err);
         } else {
              res.json(times);
         }
     });
};

