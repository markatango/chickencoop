import RPi.GPIO as gp
import time

class SwitchWatch:
    def __init__(self):
        gp.setmode(gp.BCM)
        self.up = 13
        self.dn = 26
        self.inputs = (self.up, self.dn)
        gp.setup(self.inputs, gp.IN)

    def readSws(self):
        #return {"UP": gp.input(self.up), "DOWN": gp.input(self.dn)}
        return '{"UP": 0, "DOWN": 0, "UPLIM": 1, "DNLIM": 0}'

    def showSws(self):
        upset = gp.input(self.up)
        dnset = gp.input(self.dn)
        print("UP switch(13) is ", upset)
        print("DN switch(26) is ", dnset)

if __name__ == '__main__':
    s = SwitchWatch()
    print(s.readSws())
