from twilio.rest import Client

class SendSMS:
	def __init__(self, auth):
		self.account_sid = 'ACdad1cb953003df8f6eb528cab1726de3'
		self.auth_token = auth
		self.client = Client(self.account_sid, self.auth_token)
		self.fromph = '+14159806275'
		self.toph = '+16266418432'

	def send(self, msg):
		message = self.client.messages.create(
							 body = msg,
							 from_= self.fromph,
							 to = self.toph 
						 )
						 
		print(message.sid)
	
if __name__ == "__main__":
	s = SendSMS()
	s.send("hello")
