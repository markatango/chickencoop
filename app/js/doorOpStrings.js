exports.doorOps ={ "UP" : {"door_op" : {"door" : "up", "bQuit" : "False"},
			   "doorStateMsg" : "OPEN button pressed",
		           "doorProgMsg" : "Door is opening...",
		   	   "doorOpTime" : ""},

		 "DOWN" : {"door_op" : {"door" : "down", "bQuit" : "False"},
			   "doorStateMsg" : "CLOSED button pressed",
		           "doorProgMsg" : "Door is closing...",
		   	   "doorOpTime" : ""},

		"DNLIM" : {
			   "doorStateMsg" : "CLOSED",
		           "doorProgMsg" : ""
		   	   },

		"UPLIM" : {
			   "doorStateMsg" : "OPENED",
		           "doorProgMsg" : ""
		   	   },

		"MID" : {
			   "doorStateMsg" : "In middle of travel",
			   "doorProgMsg" : ""
		   	   }

		 }
