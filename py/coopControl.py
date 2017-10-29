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

logging.basicConfig(level=logging.INFO)


class coopControl:

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
    
    currSwState = {}
    currWebSws = {}

    e = ''
    
    initialized = False
    
    def __init__(self, event, hold_time = 2.5):
        self.logger = logging.getLogger(__name__)
        coopControl.e = event
        self.logger.debug("initializing coopControl...")
        coopControl.time =  hold_time
        coopControl.init(coopControl.time)
        coopControl.currSwState = coopControl.readIOs()
        self.logger.debug("coopControl initialized")
        self.logger.info("checking dbm...")
        initlock = thread.allocate_lock()
        with initlock:
            try:
                coopControl.websws = dbm.open("websws", "c")
                coopControl.currWebSws = coopControl.websws["open"]
            except KeyError:
                coopControl.websws.close()
                coopControl.websws = dbm.open("websws", "w")
                self.logger.info("dbm not initialized. Initializing...")
                coopControl.websws["open"] = str(False)
                coopControl.websws["close"] = str(False)
                coopControl.websws.close()
                coopControl.currWebSws = coopControl.readWebsws()
                
            self.logger.info("dbm initialized.")
        
  
    @classmethod
    def init(obj, hold_time = 2.5):
        initlock = thread.allocate_lock()
        obj.logger  = logging.getLogger(__name__)
        obj.logger.info("Initializing door control....")
        coopControl.hold_time = hold_time
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            obj.gpmode = gp.getmode()
            
            if not (gp.getmode()):
                logging.info("RPiGPIO mode not set")
                with initlock:
                    gp.setmode(gp.BCM)
                    gp.setup(coopControl.inputs, gp.IN)
                    gp.setup(coopControl.outputs, gp.OUT, initial=gp.HIGH)
                    obj.gpmode = gp.getmode()
                logging.info("RPiGPIO mode is set to: " + str(obj.gpmode))
                logging.info("RPiGPIO inputs and outputs configured")
        obj.logger.info("door control initialized with hold time = " + str(hold_time))

    @classmethod
    def motorAction(obj, mbit):
        malock = thread.allocate_lock()
        with malock:
            gp.output(mbit, gp.LOW)
            sleep(coopControl.hold_time)
            gp.output(mbit, gp.HIGH)
            print "Door control bit: " + str(mbit)

    @classmethod
    def motorOp(obj, op):
        if(op == 'up'): coopControl.motorAction(coopControl.Uout)
        if(op == 'down'): coopControl.motorAction(coopControl.Dout)
        if(op == 'stop'): coopControl.motorAction(coopControl.Sout)
        
    @classmethod
    def readIOs(obj):
        rioslock = thread.allocate_lock()
        with rioslock:
            ios = {"UPS" : gp.input(coopControl.Uin),
                    "DNS" : gp.input(coopControl.Din),
                    "UPLIM" : gp.input(coopControl.u_lim),
                    "DNLIM" : gp.input(coopControl.d_lim),
                    "STS" : gp.input(coopControl.Sin),
                    "UPI" : not gp.input(coopControl.Uout),
                    "STI" : not gp.input(coopControl.Sout),
                    "DNI" : not gp.input(coopControl.Dout)
                    }
        return ios
    
    @classmethod
    def scanIOs(obj):
        sioslock = thread.allocate_lock()
        obj.logger = logging.getLogger(__name__)
        obj.logger.info("door control scanIOs launched")
        while True:
            for ins in range(len(coopControl.inputs[:3])):
                with sioslock:
                    if gp.input(coopControl.inputs[ins]):
                        coopControl.motorAction(coopControl.outputs[ins])

    @classmethod
    def readWebsws(obj):
        rwslock = thread.allocate_lock()
        obj.logger = logging.getLogger(__name__)
        with rwslock:
            ws = dbm.open("websws", "r")
            res = {"dopen": eval(ws["open"]),
                    "dclose": eval(ws["close"])
                    }
            ws.close()
        return res
 
    @classmethod
    def scanWebsws(obj):
        swslock = thread.allocate_lock()
        obj.logger = logging.getLogger(__name__)
        obj.logger.info("webcontrol scanWebsws launched")
        while True:
            ws = coopControl.readWebsws()
            if not (coopControl.currWebSws == ws):
                obj.logger.info("web button data change detected")
                coopControl.currWebSws = ws
                if (coopControl.currWebSws["dopen"] and (not coopControl.currWebSws["dclose"])):
                    coopControl.motorOp("up")
                    obj.logger.info("web button 'up' pushed")
                elif ((not coopControl.currWebSws["dopen"]) and coopControl.currWebSws["dclose"]):
                    coopControl.motorOp("down")
                    obj.logger.info("web button 'down' pushed")
                else:
                    obj.logger.info("invalid web button state")
                    sws = coopControl.readIOs()
                    swsJSON = json.dumps(sws)
                    obj.logger.info("Initial IO read result: " + swsJSON)
                    url = 'http://localhost:3000/coopevents'
                    try:
                        thePoster = poster.Poster(url, swsJSON)
                        thePoster.postStatus()
                    except IOError:
                        with swslock:
                            obj.logger.info("Server not up yet on page IO initialization")


    @classmethod
    def reportIOStatus(self):
        rioslock = thread.allocate_lock()
        while 1:
            sws = coopControl.readIOs()
            if not (sws == coopControl.currSwState):
                coopControl.currSwState = sws
                swsJSON = json.dumps(sws)
                url = 'http://localhost:3000/coopevents'
                try:
                    thePoster = poster.Poster(url, swsJSON)
                    thePoster.postStatus()
                except IOError:
                    with rioslock:
                        print "Server not up"
                    
                coopControl.e.set()
                
    @classmethod
    def close(obj):
        closelock = thread.allocate_lock()
        obj.logger = logging.getLogger(__name__)
        obj.logger.debug("Closing door control...")
        with closelock:
            gp.cleanup()
        obj.logger.debug("door control closed.")
        with closelock:
            print "Cleaned up GPIO"
                                                            
if __name__ == '__main__':

    outerLock = thread.allocate_lock()
    logger = logging.getLogger(__name__)
    logger.debug("instantiating coopControl")
    e = multiprocessing.Event()
    obj = coopControl(e)
    
    if not coopControl.initialized:
        logger.info("setting coopControl 'initialized' flag")
        coopControl.initialized = True
        logger.info("configuring independent process, 'Switch watcher'")
        w1 = multiprocessing.Process(name='Switch watcher',
                                     target = coopControl.reportIOStatus,
                                     args=())
        
        logger.info("configuring independent process, 'Scan coop IOs'")
        w2 = multiprocessing.Process(name='Scan switches',
                                     target = coopControl.scanIOs,
                                     args=())
        
        logger.info("configuring independent process, 'Scan web buttons'")
        w3 = multiprocessing.Process(name='Scan switches',
                                     target = coopControl.scanWebsws,
                                     args=())
        
        logger.info("Launching independent prcesses")
        w1.start()
        w2.start()
        w3.start()

        try:
            logging.debug("in main 'readIOs()' loop")
            while 1:
                if e.is_set():
                    with outerLock:
                        print "io status change: " + json.dumps(obj.readIOs())
                    e.clear()
                pass
            
        except KeyboardInterrupt:
            obj.close()
            logger.info("Terminating threads...")
            w1.terminate()
            w2.terminate()
            w3.terminate()
            logger.info("Cleaned up GPIO...")

##    else:
##        with outerLock:
##            logger.debug("Routine reading swtitches using door control class method")
##            print json.dumps(coopControl.readIOs())
##
##    
##
##                             
##                                  
        

    


    
    
