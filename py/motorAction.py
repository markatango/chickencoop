import sys
import time
import json
import dbm
import thread
import logging

logging.basicConfig(level=logging.DEBUG, filename="py/motorAction.log", format='%(asctime)-15s %(message)s')

class MotorAction:
    
    
    #params: '{"door" : ["up" | "down" | "read" | "stop" ], "bQuit" : ["True" | "False"]}'
    def __init__(self, params):
        initlgr = logging.getLogger(__name__)
        
        self.data = json.loads(params)
        initlgr.info("MA: motorAction init params: " + json.dumps(self.data))
        self.run(self.data['door'])

    def run(self, x):
        logger = logging.getLogger(__name__)
        logger.info("MA: Received web sw input: " + x)
        
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
        logger.info("MA: motorAction.py writing to websws dbm")
        ws.close()

if __name__ == '__main__':
    mlog = logging.getLogger(__name__)
    swlock = thread.allocate_lock()
    with swlock:
        ma = MotorAction(sys.argv[1])
        mlog.info("MA: Received: " + sys.argv[1])
    
   
               
