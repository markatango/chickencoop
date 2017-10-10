import RPi.GPIO as gp
import time
from threading import Thread

class SwitchWatch:
    def __init__(self):
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

    def readSws(self):
        
        message =  {"Uin": gp.input(self.Uin), "Din": gp.input(self.Din), "Sin": gp.input(self.Sin),
                "u_lim": gp.input(self.u_lim), "d_lim":gp.input(self.d_lim)}
        print message
        return message

    def scanSws(self):
        while True:
            for ins in range(len(self.inputs[:3])):
                if gp.input(self.inputs[ins]):
                    gp.output(self.outputs[ins], gp.LOW)
                    time.sleep(2.5)
                    gp.output(self.outputs[ins], gp.HIGH)
                    
                else:
                    gp.output(self.outputs[ins], gp.HIGH)
        

##    def showSws(self):
##        upset = gp.input(self.up)
##        dnset = gp.input(self.dn)
##        print("UP switch(13) is ", upset)
##        print("DN switch(26) is ", dnset)

if __name__ == '__main__':
    s = SwitchWatch()
    thread = Thread(target=s.scanSws)
    thread.start()
    
    try:
        while True:
            print "hi"
            time.sleep(1)
    except KeyboardInterrupt:
        thread.join()
        gp.cleanup()

        
