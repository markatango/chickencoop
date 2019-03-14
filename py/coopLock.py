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


class coopLock:

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
        
        coopLock.init()
        self.logger.info("CL: chickencoop locked.")

    @classmethod
    def init(obj):
        logger = logging.getLogger(__name__)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            obj.gpmode = gp.getmode()
            if not (gp.getmode()):
                logger.info("CL: RPiGPIO mode not set")
                gp.setmode(gp.BCM)
                gp.setup(coopLock.inputs, gp.IN)
                gp.setup(coopLock.outputs, gp.OUT, initial=gp.HIGH)
                obj.gpmode = gp.getmode()
                logger.info("CL: RPiGPIO mode is set to: " + str(obj.gpmode))
                logger.info("CL: RPiGPIO inputs and outputs configured")
                       
if __name__ == '__main__':
    obj = coopLock()
    
 
