from RPi import GPIO as gp
import sys
import time
import json
import motorControl

class MotorAction:
    
    #params: '{"door" : ["up" | "down" | "read" |], "bQuit" : ["True" | "False"]}'
    def __init__(self, params):
        self.data = json.loads(params)

        self.mc = motorControl.MotorControl()
        self.switch(self.data['door'])()
               
    def switch(self, x):
        return {
            "up" : self.mc.move_up,
            "down" : self.mc.move_dn,
            "stop" : self.mc.motor_stop
            }.get(x, self.mc.motor_stop)


if __name__ == '__main__':
    
    ma = MotorAction(sys.argv[1])
    op = '{"door" : "up", "bQuit" : "False"}'
    #ma = MotorAction(op)
    
    
   
               
