import RPi.GPIO as gp
from time import sleep
import json
import poster
import multiprocessing
import sys
import warnings
import zerorpc
import doorcontrol
import thread

class CoopSwitchesWithEvents:

    currSwState = {}
    dc = doorcontrol.DoorControl
    initialized = False
    
    def __init__(self, event):
        self.e = event
        CoopSwitchesWithEvents.dc.init(1.5)     
        CoopSwitchesWithEvents.currSwState = CoopSwitchesWithEvents.dc.readSws()

    def loop(self):
        self.lock = thread.allocate_lock()
        while 1:
            #sleep(0.1)
            with self.lock:
                sws = CoopSwitchesWithEvents.dc.readSws()
                if not (sws == CoopSwitchesWithEvents.currSwState):
                    CoopSwitchesWithEvents.currSwState = sws
                    swsJSON = json.dumps(sws)
                    url = 'http://localhost:3000/coopevents'
                    thePoster = poster.Poster(url, swsJSON)
                    thePoster.postStatus()
                    self.e.set()
                                                
if __name__ == '__main__':

    e = multiprocessing.Event()
    obj = CoopSwitchesWithEvents(e)
    outerLock = thread.allocate_lock()

    if(len(sys.argv) == 2):
	if(sys.argv[1] == 'initialize'):
	    if not CoopSwitchesWithEvents.initialized:
                CoopSwitchesWithEvents.initialized = True
                
                w1 = multiprocessing.Process(name='Switch watcher',
                                             target= obj.loop,
                                             args=())
                
                w2 = multiprocessing.Process(name='Scan switches',
                                             target=obj.dc.scanSws,
                                             args=())
                
                w1.start()
                w2.start()

                try:
                    while 1:
                        if e.is_set():
                            with outerLock:
                                print json.dumps(obj.dc.readSws())
                            e.clear()
                        pass
                    
                except KeyboardInterrupt:
                    obj.dc.cleanup()()
                    print "Terminating threads..."
                    w1.terminate()
                    w2.terminate()
                    print "Cleaned up GPIO..."

    else:
        with outerLock:
            print json.dumps(obj.dc.readSws())

    

                             
                                  
        

    


    
    
