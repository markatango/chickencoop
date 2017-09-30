import RPi.GPIO as gp
from time import sleep
import json
import poster
import multiprocessing
import sys
import warnings
import zerorpc
import doorcontrol

class CoopSwitchesWithEvents:

    currSwState = {}
    dc = doorcontrol.DoorControl
    dc.init(1.5)
    
    def __init__(self, event):
        self.e = event
             
        CoopSwitchesWithEvents.currSwState = CoopSwitchesWithEvents.dc.readSws()

    def loop(self):     
        while 1:
            #sleep(0.1)
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

    if(len(sys.argv) == 2):
	if(sys.argv[1] == 'initialize'):	    
	    w1 = multiprocessing.Process(name='Switch watcher',
	                                 target= obj.loop,
	                                 args=())
	    
	    w2 = multiprocessing.Process(name='Scan switches',
	                                 target=obj.dc.scanSws,
	                                 args=())

##	    w3 = multiprocessing.Process(name='Scan web controls',
##					 target=obj.scanWeb,
##					 args=())
	    
	    w1.start()
	    w2.start()
##	    w3.start()
	    
	    try:
	        while 1:
	            if e.is_set():
	                print json.dumps(obj.dc.readSws())
	                e.clear()
	            pass
	    except KeyboardInterrupt:
	        obj.dc.cleanup()()
	        print "Terminating threads..."
	        w1.terminate()
	        w2.terminate()
##	        w3.terminate()
        	print "Cleaned up GPIO..."

    else: print json.dumps(obj.dc.readSws())

	
    

    

                             
                                  
        

    


    
    
