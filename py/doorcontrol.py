import RPi.GPIO as gp
from time import sleep
import multiprocessing
import sys
import warnings

class DoorControl:

    Uin = 18
    Sin = 17
    Din = 4
    u_lim = 22
    d_lim = 27
    Uout = 5
    Sout = 25
    Dout = 23
    inputs = [Uin, Sin, Din, u_lim, d_lim]
    outputs = [Uout, Sout, Dout]
    time = 2.5
    
    @classmethod
    def init(obj, hold_time = 2.5):
        DoorControl.hold_time = hold_time
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            gp.setmode(gp.BCM)
            gp.setup(DoorControl.inputs, gp.IN)
            gp.setup(DoorControl.outputs, gp.OUT, initial=gp.HIGH)
            
    @classmethod
    def motorAction(obj, mbit):
        gp.output(mbit, gp.LOW)
        sleep(DoorControl.hold_time)
        gp.output(mbit, gp.HIGH)
        print "Door control bit: " + str(mbit)

    @classmethod
    def motorOp(obj, op):
        if(op == 'up'): DoorControl.motorAction(DoorControl.Uout)
        if(op == 'down'): DoorControl.motorAction(DoorControl.Dout)
        if(op == 'stop'): DoorControl.motorAction(DoorControl.Sout)
        
    @classmethod
    def readSws(obj):
        return {"UPS" : gp.input(DoorControl.Uin),
                "DNS" : gp.input(DoorControl.Din),
                "UPLIM" : gp.input(DoorControl.u_lim),
                "DNLIM" : gp.input(DoorControl.d_lim),
                "STS" :gp.input(DoorControl.Sin)
                }
    
    @classmethod
    def scanSws(obj):
        while True:
            for ins in range(len(DoorControl.inputs[:3])):
                if gp.input(DoorControl.inputs[ins]):
                    DoorControl.motorAction(DoorControl.outputs[ins])

    @classmethod
    def close(obj):
        gp.cleanup()
        print "Cleaned up GPIO"

if __name__ == '__main__':
    f = DoorControl
    f.init(0.3)
    for i in range(2):
        f.motorOp(op='up')
        f.motorOp(op='down')
        f.motorOp(op='stop')
    f.close()

                                

                             
                                  
        

    


    
    
