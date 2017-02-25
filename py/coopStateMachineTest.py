'''https://www.ibm.com/developerworks/library/l-python-state/'''
from coopStateMachine import CoopStateMachine
import switchWatch as sw
import motorControl as mc

# singleton
sw = SwitchWatch()
mc = MotorControl()

def door_up(switchStates):
     print "Door up State"
     while 1:
          if switchStates['DN'] && !switchStates['DNLIM']:
               newState = "DOOR_MOVING_DN"
               mc.down()
               break
          elif switchStates['DN'] &&  switchStates['DNLIM']:
               newState = "DOOR_DN"
               mc.stop()
               break
          else:
               switchStates = sw.readSwitches()
               
     return (newState, switchStatesval)

def door_moving_dn(switchStates):
     print  "door moving down State: ",
     while 1:
        if switchStates['STOP'] 
             mc.stop()
             newState =  "STOPPED";
             break
        elif switchStates['DN_LIM'] 
             newState =  "DOWN";
             break
        elif switchStates['UP'] 
             mc.stop()
             newState =  "STOPPED";
             break
        else:
             switchStatesval = sw.readSwitches()
     return (newState, switchStatesvalval)

def door_moving_up(switchStates):
     print  "door moving up State: ",
     while 1:
        if switchStates['STOP'] 
             mc.stop()
             newState =  "STOPPED";
             break
        elif switchStates['UP_LIM'] 
             newState =  "UP";
             break
        elif switchStates['DN'] 
             mc.stop()
             newState =  "STOPPED";
             break
        else:
             switchStatesval = sw.readSwitches()
     return (newState, switchStatesvalval)

def door_dn(switchStates):
     print "Door dn State"
     while 1:
          if switchStates['UP'] && !switchStates['UPLIM']:
               newState = "DOOR_MOVING_UP"
               mc.up()
               break
          elif switchStates['UPLIM']:
               newState = "DOOR_UP"
               mc.stop()
               break
          else:
               switchStates = sw.readSwitches()
               
     return (newState, switchStatesval)

def door_st(switchStates):
     print "Door st State"
     while 1:
          if switchStates['UP'] && !switchStates['UPLIM']:
               newState = "DOOR_MOVING_UP"
               mc.up()
               break
          elif switchStates['UPLIM']:
               newState = "DOOR_UP"
               mc.stop()
               break
          elif switchStates['DNLIM']:
               newState = "DOOR_DN"
               mc.stop()
               break
          elif switchStates['DN'] && !switchStates['DNLIM']:
               newState = "DOOR_MOVING_DN"
               mc.down()
               break
          else:
               switchStates = sw.readSwitches()
               
     return (newState, switchStatesval)

if __name__== "__main__":
       m = CoopStateMachine()
       m.add_state("DOOR_UP", door_up)
       m.add_state("DOOR_MOVING_DN", door_moving_dn)
       m.add_state("STOPPED", door_st)
       m.add_state("DOOR_DN", door_dn)
       m.add_state("DOOR_MOVING_UP", door_moving_up)
       m.add_state("end", None, end_state=1)
       m.set_start("STOPPED")
       m.run(1)
