import RPi.GPIO as gp
from time import sleep
import json
import poster
import multiprocessing
import sys
import warnings
import thread
import logging
import urllib
import dbm

logging.basicConfig(level=logging.DEBUG, filename="coop.log", format='%(asctime)-15s %(message)s')


class coopDoor:

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
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.logger.debug("CL: locking chickencoop..")
        
        self.init()
        self.logger.info("CL: chickencoop locked.")

    
    def init(self):
        logger = logging.getLogger(__name__)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            self.gpmode = gp.getmode()
            if not (gp.getmode()):
                logger.info("CL: RPiGPIO mode not set")
                gp.setmode(gp.BCM)
                gp.setup(coopDoor.inputs, gp.IN)
                gp.setup(coopDoor.outputs, gp.OUT, initial=gp.HIGH)
                self.gpmode = gp.getmode()
                logger.info("CL: RPiGPIO mode is set to: " + str(self.gpmode))
                logger.info("CL: RPiGPIO inputs and outputs configured")

    
    def open(self):
        self.logger = logging.getLogger(__name__)
        self.logger.debug("CD: Opening...")
        gp.output(coopDoor.Uout, gp.LOW)
        sleep(2.5)
        gp.output(coopDoor.Uout, gp.HIGH)
        if gp.input(coopDoor.u_lim):
            self.logger.debug("CD: Opened.")
            print "CD: Opened."
                    
    def close(self):
        self.logger = logging.getLogger(__name__)
        self.logger.debug("CD: Closing...")
        gp.output(coopDoor.Dout, gp.LOW)
        sleep(2.5)
        gp.output(coopDoor.Dout, gp.HIGH)
        if gp.input(coopDoor.d_lim):
            self.logger.debug("CD: Closed.")
            print "CD: Closed."
        
                       
if __name__ == '__main__':
    obj = coopDoor()
    if sys.argv[1] == 'open':
        obj.open()
    if sys.argv[1] == 'close':
        obj.close()
        
    
 
