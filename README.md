# Chickencoop controller using Raspberry Pi
Chicken coop controller for door, lights, and electrical and environmental monitoring.

This device provides user controls to operate two CCTV cameras, open and close the chicken hatch door, and control a couple of auxiliary AC relays that can be used to turn inside and outside lights on and off. 

The cameras can be steered by means of directional buttons. The hatch door is opened and closed based on user-settable times, or manually
using "Open" and "Clost" buttons on the user interface.  The hardware in the chickencoop also includes physical buttons to open and close the door.

Another purpose for this project is to build a toy implemenation of an IoT device with predictive maintenance. So additional work is planned.

The chicken coop is powered by a solar array with local power storage.  Further work includes:
* MMonitoring the battery voltage and charging / discharging currents
* Monitoring chicken coop temperature
* Reporting and recording door open and close times
* Charting above variables on the user interface
* Integrating AWS IoT to send SMS messages when any changes is state have occurred (such as door or light operation), and repots 
temperature and door operation times.
* Developing a predicive model for door maintenance.

TO DO: See "Issues".

 
