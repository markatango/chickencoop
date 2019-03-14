import ntplib
from time import ctime

c = ntplib.NTPClient()
response = c.request('north-america.pool.ntp.org', version=3)
#print(response.tx_time)
print(ctime(response.tx_time))


#print(ntplib.ref_id_to_text(response.ref_id))
