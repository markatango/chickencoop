from RPi import GPIO as gp
import sys
import time
import json

from coopSwitchesWithEvents import CoopSwitchesWithEvents
import multiprocessing as mp

class MotorAction:
    
    #params: '{"door" : ["up" | "down" | "read" | "stope" ], "bQuit" : ["True" | "False"]}'
    def __init__(self, params):
        self.data = json.loads(params)
        self.e = mp.Event()
        self.obj = CoopSwitchesWithEvents(self.e)
       
        self.switch(self.data['door'])

    def switch(self, x):
        self.obj.motorOp(x)
	print self.data['door']


if __name__ == '__main__':
    
    ma = MotorAction('{"door":"up"}')
    
    
   
               
