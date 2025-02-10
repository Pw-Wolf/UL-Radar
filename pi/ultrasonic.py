import RPi.GPIO as GPIO
import time

# GPIO.setmode(GPIO.BCM)
# GPIO.setwarnings(False)

# # ultrazvuk 1
# PIN_TRIGGER = 6 # Ljubicasta zica
# PIN_ECHO = 13 # Siva 

# # # ultrazvuk 2
# PIN_TRIGGER = 26 # crna zica
# PIN_ECHO = 19 # smedja

# GPIO.setup(PIN_ECHO, GPIO.IN)
# GPIO.setup(PIN_TRIGGER, GPIO.OUT)

def sensor_data(PIN_TRIGGER, PIN_ECHO):
	GPIO.output(PIN_TRIGGER, GPIO.LOW)
	time.sleep(0.0001)
	GPIO.output(PIN_TRIGGER, GPIO.HIGH)
	time.sleep(0.0001)
	GPIO.output(PIN_TRIGGER, GPIO.LOW)

	stuck = time.time()
	while GPIO.input(PIN_ECHO)==0 and (time.time() - stuck < 0.03):
		pass
	pulse_start_time = time.time()

	while GPIO.input(PIN_ECHO)==1:
		pass
	pulse_end_time = time.time()

	return round((pulse_end_time - pulse_start_time) * 17150, 2)

if __name__ == "__main__":
	while True:
		a = sensor_data()
		print(a)
		time.sleep(1)