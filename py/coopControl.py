import RPi.GPIO as gp
from time import sleep
import json
import poster
import multiprocessing
import sys
import warnings
import threading
import logging
import urllib
import dbm

logging.basicConfig(level=logging.DEBUG, filename="coop.log", format='%(asctime)-15s %(message)s')
lock = threading.RLock()

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
        self.logger.debug("CC: initializing coopControl...")
        coopControl.time =  hold_time
        coopControl.init(coopControl.time)
        coopControl.currSwState = coopControl.readIOs()
        self.logger.debug("CC: coopControl initialized")
        self.logger.info("CC: checking dbm...")
        with lock:
            try:
                coopControl.websws = dbm.open("websws", "c")
                coopControl.currWebSws = coopControl.websws["open"]
            except KeyError:
                coopControl.websws.close()
                coopControl.websws = dbm.open("websws", "w")
                self.logger.info("CC: dbm not initialized. Initializing...")
                coopControl.websws["open"] = str(False)
                coopControl.websws["close"] = str(False)
                coopControl.websws.close()
                coopControl.currWebSws = coopControl.readWebsws()
                
            self.logger.info("CC: dbm initialized.")
        
  
    @classmethod
    def init(obj, hold_time = 2.5):
        logger  = logging.getLogger(__name__)
        logger.info("CC: Initializing door control....")
        coopControl.hold_time = hold_time
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            obj.gpmode = gp.getmode()
            
            if not (gp.getmode()):
                logger.info("CC: RPiGPIO mode not set")
                with lock:
                    gp.setmode(gp.BCM)
                    gp.setup(coopControl.inputs, gp.IN)
                    gp.setup(coopControl.outputs, gp.OUT, initial=gp.HIGH)
                    obj.gpmode = gp.getmode()
                logger.info("CC: RPiGPIO mode is set to: " + str(obj.gpmode))
                logger.info("CC: RPiGPIO inputs and outputs configured")
                logger.info("CC: door control initialized with hold time = " + str(hold_time))

    @classmethod
    def motorAction(obj, mbit):
        with lock:
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
        '''
        Returns status of all I/O lines. Be sure this function is called
        inside a lock
        '''
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
        logger = logging.getLogger(__name__)
        logger.info("CC: door control scanIOs launched")
##        while True:
##            with lock:
##                for ins in range(len(coopControl.inputs[:3])):
##                    if gp.input(coopControl.inputs[ins]):
##                        coopControl.motorAction(coopControl.outputs[ins])
##            pass
        logger.info("CC: door control scanIOs terminated, ignoring local switches")

    @classmethod
    def readWebsws(obj):
        '''
        Returns status of last web switch action. Be sure this function is called
        inside a lock
        '''
        obj.logger = logging.getLogger(__name__)
        dbpath = "/home/pi/nodes/chickencoop/py/websws"
        ws = dbm.open(dbpath, "r")
        res = {"dopen": eval(ws["open"]),
                "dclose": eval(ws["close"])
                }
        ws.close()
        return res
 
    @classmethod
    def scanWebsws(obj):
        logger = logging.getLogger(__name__)
        logger.info("CC: webcontrol scanWebsws launched")
        while True:
            with lock:
                ws = coopControl.readWebsws()
                if not (coopControl.currWebSws == ws):
                    logger.info("CC: web button data change detected")
                    coopControl.currWebSws = ws
                    if (coopControl.currWebSws["dopen"] and (not coopControl.currWebSws["dclose"])):
                        coopControl.motorOp("up")
                        logger.info("CC: web button 'up' pushed")
                    elif ((not coopControl.currWebSws["dopen"]) and coopControl.currWebSws["dclose"]):
                        coopControl.motorOp("down")
                        logger.info("CC: web button 'down' pushed")
                    else:
                        logger.info("CC: invalid web button state")
                        sws = coopControl.readIOs()
                        swsJSON = json.dumps(sws)
                        logger.info("CC: Initial IO read result: " + swsJSON)
                        url = 'http://localhost:3000/coopevents'
                        try:
                            thePoster = poster.Poster(url, swsJSON)
                            thePoster.postStatus()
                        except IOError:
                            logger.info("CC: Server not up yet on page IO initialization")
            pass ## terminate lock just in case the while loop doesn't do that


    @classmethod
    def reportIOStatus(self):
        logger = logging.getLogger(__name__)
        logger.info("CC: reportIOStatus launched")
        setEventCountList = []
        setEventCount = 0
        while 1:
            with lock:
                sws = coopControl.readIOs()
                if not (sws == coopControl.currSwState):
                    logger.debug("CC: IO Status change, attempting to post...")
                    coopControl.currSwState = sws
                    swsJSON = json.dumps(sws)
                    url = 'http://localhost:3000/coopevents'
                    if not e.is_set():
                        try:
                            setEventCountList.append(setEventCount)
                            setEventCount = 0
                            logger.debug("CC: IO Status change, posting...")
                            thePoster = poster.Poster(url, swsJSON)
                            thePoster.postStatus()
                            logger.debug("CC: IO Status change, post succeeded, setting event")
                            coopControl.e.set()
                        except IOError:
                            logger.debug("CC: IO Status change, post failed")
                            logger.debug("Server not up")
                    else:
                        setEventCount += 1
                        logger.debug("CC: Unanswered event count: "  + str(setEventCount))
            pass        
                
    @classmethod
    def close(obj):
        logger = logging.getLogger(__name__)
        logger.debug("CC: Closing door control...")
        with lock:
            gp.cleanup()
            logger.debug("CC: door control closed.")
            logger.debug("print CC: Cleaned up GPIO")
                                                            
if __name__ == '__main__':


    logger = logging.getLogger(__name__)
    logger.debug("CC: instantiating coopControl")
    e = multiprocessing.Event()
    obj = coopControl(e)
    
    if not coopControl.initialized:
        logger.info("CC: setting coopControl 'initialized' flag")
        coopControl.initialized = True
        logger.info("CC: configuring independent process, 'Switch watcher'")
        w1 = multiprocessing.Process(name='Switch watcher',
                                     target = coopControl.reportIOStatus,
                                     args=())
        
        logger.info("CC: configuring independent process, 'Scan coop IOs'")
        w2 = multiprocessing.Process(name='Scan switches',
                                     target = coopControl.scanIOs,
                                     args=())
        
        logger.info("CC: configuring independent process, 'Scan web buttons'")
        w3 = multiprocessing.Process(name='Scan switches',
                                     target = coopControl.scanWebsws,
                                     args=())
        
        logger.info("CC: Launching independent prcesses")
        w1.start()
        w2.start()
        w3.start()

    try:
        logger.debug("CC: in main 'readIOs()' loop")
        while 1:
            with lock:
                e.wait()
                if e.is_set():
                    logger.debug("event received in main thread: io status change: " + json.dumps(obj.readIOs()))
                    e.clear()
            pass
        
    except Exception as e:
        obj.close()
        logger.info("CC: Main loop exception: " + e.strerror)
        logger.info("CC: Terminating threads...")
        w1.terminate()
        w2.terminate()
        w3.terminate()
        logger.info("CC: Cleaned up GPIO...")

##    else:
##        with outerLock:
##            logger.debug("Routine reading swtitches using door control class method")
##            print json.dumps(coopControl.readIOs())
##
##    
##
##                             
##                                  
        

    


    
    
