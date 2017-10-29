import RPi.GPIO as gp
from time import sleep
import multiprocessing
import sys
import warnings
import logging

logging.basicConfig(level=logging.DEBUG)

class DoorControl:
    def __init__(self, logger=None):
        self.logger = logging.getLogger(__name__)

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
        obj.logger  = logging.getLogger(__name__)
        obj.logger.info("Initializing door control....")
        DoorControl.hold_time = hold_time
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            obj.gpmode = gp.getmode()
            
            if not (gp.getmode()):
                logging.info("RPiGPIO mode not set")
                gp.setmode(gp.BCM)
                gp.setup(DoorControl.inputs, gp.IN)
                gp.setup(DoorControl.outputs, gp.OUT, initial=gp.HIGH)
                obj.gpmode = gp.getmode()
                logging.info("RPiGPIO mode is set to: " + str(obj.gpmode))
                logging.info("RPiGPIO inputs and outputs configured")
        obj.logger.info("door control initialized with hold time = " + str(hold_time))

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
                "STS" : gp.input(DoorControl.Sin),
                "UPI" : not gp.input(DoorControl.Uout),
                "STI" : not gp.input(DoorControl.Sout),
                "DNI" : not gp.input(DoorControl.Dout)
                }
    
    @classmethod
    def scanSws(obj):
        obj.logger = logging.getLogger(__name__)
        obj.logger.info("door control scanSws launched")
        while True:
            for ins in range(len(DoorControl.inputs[:3])):
                if gp.input(DoorControl.inputs[ins]):
                    DoorControl.motorAction(DoorControl.outputs[ins])

    @classmethod
    def close(obj):
        obj.logger = logging.getLogger(__name__)
        obj.logger.debug("Closing door control...")
        gp.cleanup()
        obj.logger.debug("door control closed.")
        print "Cleaned up GPIO"

if __name__ == '__main__':
    logger = logging.getLogger(__name__)
    logger.info("Initializing doorControl and cycling through the motor operations")
    f = DoorControl
    f.init(0.3)
    for i in range(2):
        f.motorOp(op='up')
        f.motorOp(op='down')
        f.motorOp(op='stop')
    f.close()
    logger.info("door Control cycling ended")
   

                                

                             
                                  
        

    


    
    
