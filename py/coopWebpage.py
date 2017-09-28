import zerorpc
import time

class coopWebpage(object, event):
    def __init__(self, object, event):
        self.obj = object
        self.ev = event
        
    def scanWebpage(self, name):
        print "Received: %s" % name
        self.ev.set()

s = zerorpc.Server(HelloRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()

