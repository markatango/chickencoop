from RPi import GPIO as gp
import sys
import time
import json
import doorcontrol as dc

class MotorAction:
    dcc = dc.DoorControl
    
    #params: '{"door" : ["up" | "down" | "read" | "stop" ], "bQuit" : ["True" | "False"]}'
    def __init__(self, params):
        MotorAction.dcc.init(1.5)
        self.data = json.loads(params)     
        self.switch(self.data['door'])

    def switch(self, x):
        MotorAction.dcc.motorOp(x)

if __name__ == '__main__':
    
    ma = MotorAction(sys.argv[1])
    print sys.argv[1]
    
   
               
