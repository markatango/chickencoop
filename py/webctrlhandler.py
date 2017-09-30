import zerorpc
import time

class WebCtrlHandler(object):
    
    def opensw(self, name):
        print "Received: %s" % name
        return "Hello, %s" % name

    def closesw(self, name):
        print "Received: %s" % name
        return "Goodbye, %s" % name


if __name__ == '__main__':
    try:
        s = zerorpc.Server(WebCtrlHandler())
        s.bind("tcp://0.0.0.0:4242")
        s.run() 

    except KeyboardInterrupt:
        print "closing python socket server"
