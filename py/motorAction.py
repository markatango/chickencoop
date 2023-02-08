import sys
import time
import json
import dbm
import thread
import logging

logging.basicConfig(level=logging.DEBUG, filename="py/motorAction.log", format='%(asctime)-15s %(message)s')

class MotorAction:
    """
    Update web switch database with most recent open / close button push actions.
    
    This function is spawned by the button.server.controller.  Another thread monitors 
    whether the switch state chanages and if so, initiates a corresponding motor action.
    """
    
    
    #params: '{"door" : ["up" | "down" | "read" | "stop" ], "bQuit" : ["True" | "False"]}'
    def __init__(self, params):
        initlgr = logging.getLogger(__name__)
        
        self.data = json.loads(params)
        initlgr.info("MA: motorAction init params: " + json.dumps(self.data))
        

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
        logger.info("MA: motorAction.py writing to websws dbm open:{} close:{}".format(ws["open"],ws["close"]))
        ws.close()
        # return json.dumps(self.data)
        return x

if __name__ == '__main__':
    mlog = logging.getLogger(__name__)
    swlock = thread.allocate_lock()
    with swlock:
        ma = MotorAction(sys.argv[1])
        ma.run(ma.data['door'])
        mlog.info("MA: Received: " + sys.argv[1])
    
   
               
