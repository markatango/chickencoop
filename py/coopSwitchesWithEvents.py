import RPi.GPIO as gp
from time import sleep
import json
import poster
import multiprocessing

class CoopSwitchesWithEvents:

    currSwState = {}
    
    def __init__(self, event):

        self.e = event
        self.UP = 22
        self.DN = 5
        self.STOP = 26
        self.UPLIM = 6
        self.DNLIM = 13
        
        gp.setmode(gp.BCM)

        self.inputs = (self.UP, self.DN, self.STOP, self.UPLIM, self.DNLIM)
        gp.setup(self.inputs, gp.IN)
        
        CoopSwitchesWithEvents.currSwState = self.readSws()

    def readSws(self):
        return {'UP' : gp.input(self.UP),
                "DN" : gp.input(self.DN),
                "UPLIM" : gp.input(self.UPLIM),
                "DNLIM" : gp.input(self.DNLIM),
                "STOP" :gp.input(self.STOP)
                }

##    def setWatch(self, swNames):
##        

    def loop(self):
        
        while 1:
            #sleep(0.1)
            sws = self.readSws()
            if not (sws == CoopSwitchesWithEvents.currSwState):
                CoopSwitchesWithEvents.currSwState = sws
                swsJSON = json.dumps(sws)
                url = 'http://localhost:3000/coopEvents'
                thePoster = poster.Poster(url, swsJSON)
                thePoster.postStatus()
                self.e.set()
##                break
##                print "Up:" + str(sws["UP"])
##                print "Dn:" + str(sws["DN"])
##                print "St:" + str(sws["STOP"])
##                print "DL:" + str(sws["DNLIM"])
##                print "UL:" + str(sws["UPLIM"])
                
                
if __name__ == '__main__':
    e = multiprocessing.Event()
    obj = CoopSwitchesWithEvents(e)
    w1 = multiprocessing.Process(name='Switch watcher',
                                 target= obj.loop,
                                 args=())
    w1.start()
    
    while 1:
        if e.is_set():
            print json.dumps(obj.readSws())
            e.clear()
    

    

                             
                                  
        

    


    
    
