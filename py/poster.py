import urllib

class Poster:
    
    def __init__(self, url, cargo):
        self.cargo = cargo
        self.url = url

    def postStatus(self):
        
        self.appid = 'ChickenCoop'

        self.context = '''
        Switch status
        '''
        self.query = self.cargo

        self.params = urllib.urlencode({
                'appid': self.appid,
                'context': self.context,
                'query': self.query
        })

        self.data = urllib.urlopen(self.url, self.params).read()
        return self.data
     

if __name__ == '__main__':
    thePost = Poster( 'http://localhost:3000/coopEvents',
                      { "UP": 0, "DOWN": 1,"STOP": 0, "UPLIM": 1, "DNLIM": 0 })
    print(thePost.cargo)
    thePost.postStatus()
    
    
