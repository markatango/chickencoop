##------+--------------+--------
##      |              |
##       \A             \B
##      |              |
##      +----|MOTOR|---+
##      |              |
##       \C             \D
##      |              |
##------+--------------+--------


import RPi.GPIO as gp
import json
import multiprocessing as mp
from time import sleep
from coopSwitchesWithEvents import CoopSwitchesWithEvents

class MotorControl:

    safetyDelay = 0.3
    breakDelay = 0.5
    maxMotorOnTime = 2.5
    
    def __init__(self):
        # Motor phases
        self.A = 24
        self.B = 25
        self.C = 12
        self.D = 16
        
        gp.setmode(gp.BCM)
        
        self.motor = (self.A, self.B, self.C, self.D)
        self.goup = (self.A, self.D)
        self.godn = (self.B, self.C)
        self.stop = (self.A, self.B)
        gp.setup(self.motor, gp.OUT, initial= gp.LOW)

        self.e = mp.Event()
        self.obj = CoopSwitchesWithEvents(self.e)
        self.w1 = mp.Process(name='Switch watcher',
                                 target= self.obj.loop,
                                 args=())
        self.w1.start()

    def motor_safe_delay(self, dly):
        gp.output(self.motor, gp.LOW)
        sleep(dly)

    def move_dn(self):
        self.motor_safe_delay(MotorControl.safetyDelay)
        gp.output(self.godn, gp.HIGH)
        self.e.wait(MotorControl.maxMotorOnTime)
        gp.output(self.godn, gp.LOW)
        if self.e.is_set():
            print("DN limit reached in time")
        else:
            print("timeout")
        self.motor_end()

    def move_up(self):
        self.motor_safe_delay(MotorControl.safetyDelay)
        gp.output(self.goup, gp.HIGH)
        self.e.wait(MotorControl.maxMotorOnTime)
        gp.output(self.goup, gp.LOW)
        if self.e.is_set():
            print("UP limit reached in time")
        else:
            print("timeout")
        self.motor_end()

    def motor_stop(self):
        self.motor_safe_delay(MotorControl.safetyDelay)
        gp.output(self.stop, gp.HIGH)
        sleep(MotorControl.breakDelay)
        gp.output(self.stop, gp.LOW)
        print("Motor stopped.")
        self.motor_end()

    def motor_end(self):
        gp.cleanup()
        self.w1.terminate()
        
        
        
if __name__ == '__main__':
    MotorControl().move_dn()
    sleep(3)
    MotorControl().move_up()
    MotorControl().motor_stop()

    
    
    
    
