var clockEvent = require('./clockEvent');

module.exports = (function(){
  return {
    start : function(io){
         setInterval(function(){
            clockEvent.update(io);
         }, 1000);         
    }
  } 
})();

