import RPi.GPIO as GPIO
import time

# Set GPIO numbering mode
GPIO.setmode(GPIO.BCM)
red_led = 27
mic = 4

# Set pin 11 as an output, and define as servo1 as PWM pin
GPIO.setup(17,GPIO.OUT)
GPIO.setup(red_led,GPIO.OUT)
GPIO.setup(mic,GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

servo1 = GPIO.PWM(17,50) # pin 11 for servo1, pulse 50Hz

GPIO.output(red_led, GPIO.LOW)

# Start PWM running, with value of 0 (pulse off)
servo1.start(0)
current = 0

def left():
	servo1.ChangeDutyCycle(2+(110/18))
	time.sleep(0.05)
	servo1.ChangeDutyCycle(0)
	

def right():
	servo1.ChangeDutyCycle(2+(60/18))
	time.sleep(0.05)
	servo1.ChangeDutyCycle(0)