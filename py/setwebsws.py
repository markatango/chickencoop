import dbm
from time import sleep

def setwebsws():
    
    while True:
        
        ws = dbm.open("websws", "w")
        ws["open"] = str(True)
        ws["close"] = str(False)
        ws.close()
        sleep(1)
        ws = dbm.open("websws", "w")
        ws["open"] = str(False)
        ws["close"] = str(True)
        ws.close()
        sleep(1)
        ws = dbm.open("websws", "w")
        ws["open"] = str(False)
        ws["close"] = str(False)
        ws.close()


if __name__ == '__main__':
    try:
        setwebsws()
    except KeyboardInterrupt:
        print "setwebsws terminated"


        
    
    
