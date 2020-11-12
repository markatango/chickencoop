from twilio.rest import Client
import os
class SendSMS:

	def __init__(self, toPh):
		self.account_sid = os.environ.get('TWILIO_SID')
		self.auth_token = os.environ.get('TWILIO_TOKEN')
		self.fromph = os.environ.get('TWILIO_PHONE_FROM')
		self.toph = toPh

                print(self.auth_token)
                print(self.account_sid)
                print(self.fromph)
                print(self.toph)

                self.client = Client(self.account_sid, self.auth_token)
	def send(self, msg):
 		message = self.client.messages.create(
							 body = msg,
							 from_= self.fromph,
							 to = self.toph 
						 )
						 
		print(message.sid)
	
if __name__ == "__main__":
 	to = os.environ.get('TWILIO_PHONE_TO')
	s = SendSMS(to)
	s.send("hello")
