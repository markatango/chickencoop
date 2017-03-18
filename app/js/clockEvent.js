module.exports = (function(){

    var lastTime;

    var getTime = function(){
        var getDate = new Date(),
            hr = getDate.getHours(),
            min = getDate.getMinutes();

    var timeOfDay = (hr < 12) ? "AM" : "PM";
        hr = (hr > 12) ? hr -= 12 : hr;
        hr = (hr == 0) ? 12 : hr;
        min = (min < 10 ? "0" : "") + min;

        return hr + ":" + min + " " + timeOfDay;   
    };

    return {
        update : function(io){
	    var curTime = getTime();
	    /*console.log('in clockEvent.update'); 
	    console.log('curTime: ' + curTime);
	    console.log('lastTime: ' + lastTime);
	    */
            if(curTime != lastTime ) {
	        //console.log("updating...");
	        io.emit('clockReadout', curTime);
	        lastTime = curTime;
	    };
        },

        immediate : function(io){
            var now = getTime();
            lastTime = now;
           // console.log('immediate clock update: ' + now);
            io.emit('clockReadout', now);
        } 
    };
})();
