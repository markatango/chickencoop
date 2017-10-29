##from RPi import GPIO as gp
import sys
import time
import json
##import doorcontrol as dc
##import coopSwitchesWithEvents as cswe
import dbm
import thread
import logging
logging.basicConfig(level=logging.INFO)

class MotorAction:
    
    
    #params: '{"door" : ["up" | "down" | "read" | "stop" ], "bQuit" : ["True" | "False"]}'
    def __init__(self, params):
        self.data = json.loads(params)     
        self.switch(self.data['door'])

    def switch(self, x):
        logger = logging.getLogger(__name__)
        logger.info("received web sw input: " + x)
        swlock = thread.allocate_lock()
        with swlock:
            dbpath = "/home/pi/nodes/chickencoop/py/websws"
            ws = dbm.open(dbpath, "w")
            if x == "up":
                ws["open"] = str(True)
                ws["close"] = str(False)
            elif x == "down":
                ws["open"] = str(False)
                ws["close"] = str(True)
            else:
                ws["open"] = str(False)
                ws["close"] = str(False)
            ws.close()

if __name__ == '__main__':
    
    ma = MotorAction(sys.argv[1])
    print sys.argv[1]
    
   
               
