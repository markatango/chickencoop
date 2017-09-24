import RPi.GPIO as gp
from time import sleep
import json
import poster
import multiprocessing

class CoopSwitchesWithEvents:

    currSwState = {}
    
    def __init__(self, event):

        self.e = event

        gp.setmode(gp.BCM)
        self.Uin = 18
        self.Sin = 17
        self.Din = 4
        self.u_lim = 22
        self.d_lim = 27
        self.Uout = 5
        self.Sout = 25
        self.Dout = 23
        self.inputs = [self.Uin, self.Sin, self.Din,
                       self.u_lim, self.d_lim]
        self.outputs = [self.Uout, self.Sout, self.Dout]
        gp.setup(self.inputs, gp.IN)
        gp.setup(self.outputs, gp.OUT, initial=gp.HIGH)
        
        CoopSwitchesWithEvents.currSwState = self.readSws()

    def readSws(self):
        return {"UPS" : gp.input(self.Uin),
                "DNS" : gp.input(self.Din),
                "UPLIM" : gp.input(self.u_lim),
                "DNLIM" : gp.input(self.d_lim),
                "STS" :gp.input(self.Sin)
                }

    def loop(self):
        
        while 1:
            #sleep(0.1)
            sws = self.readSws()
            if not (sws == CoopSwitchesWithEvents.currSwState):
                CoopSwitchesWithEvents.currSwState = sws
                swsJSON = json.dumps(sws)
                url = 'http://localhost:3000/coopevents'
                thePoster = poster.Poster(url, swsJSON)
                thePoster.postStatus()
                self.e.set()

    def scanSws(self):
        while True:
            for ins in range(len(self.inputs[:3])):
                if gp.input(self.inputs[ins]):
                    gp.output(self.outputs[ins], gp.LOW)
                    sleep(2.5)
                    gp.output(self.outputs[ins], gp.HIGH)
                    
                else:
                    gp.output(self.outputs[ins], gp.HIGH)

                
if __name__ == '__main__':
    e = multiprocessing.Event()
    obj = CoopSwitchesWithEvents(e)
    
    w1 = multiprocessing.Process(name='Switch watcher',
                                 target= obj.loop,
                                 args=())
    
    w2 = multiprocessing.Process(name='Scan switches',
                                 target=obj.scanSws,
                                 args=())
    w1.start()
    w2.start()
    
    try:
        while 1:
            if e.is_set():
                print json.dumps(obj.readSws())
                e.clear()
            pass
    except KeyboardInterrupt:
        gp.cleanup()
        w1.terminate()
        w2.terminate()
        print "Cleaned up GPIO..."
    

    

                             
                                  
        

    


    
    
