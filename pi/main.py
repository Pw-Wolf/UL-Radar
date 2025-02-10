import RPi.GPIO as GPIO
import time
import threading

import requests
import json

import motor, microphone, display, ultrasonic


CURR = 0
URL = "localhost:8080/ocitanja"
# URL = "http://192.168.0.52:8080/ocitanja"

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

leds = [21, 20] # green, red
GPIO.setup(leds,GPIO.OUT)
GPIO.output(leds, GPIO.LOW)

# ultrazvuk 1
GPIO.setup([13, 19], GPIO.IN)
# ultrazvuk 2
GPIO.setup([6, 26], GPIO.OUT)

def status_led(led):
	active = False
	while True:
		GPIO.output(led, active := not(active))
		time.sleep(0.5)
  
def close_led(us_1, us_2):
	if us_1 < 15 or us_2 < 15:
		GPIO.output(leds, GPIO.HIGH)
		return True
	GPIO.output(leds, GPIO.LOW)
	return False

def send_data(data):
	try:
		response = requests.post(URL, data=json.dumps(data), timeout=0.5)
		if response.status_code == 201:
			print(f"Uspješno poslan zahtjev: {response.json()}")
			return True
	except requests.exceptions.RequestException as e:
		print(f"Greška: {e}\nStatus: {response.status_code}")
		return False

def rakija(number):
    return 1000 if number > 1000 else number

def main():
	global CURR
	count = 8
	while True:
		for _ in range(count):
			motor.right()
			us_1 = rakija(ultrasonic.sensor_data(6, 13))
			us_2 = rakija(ultrasonic.sensor_data(26, 19))
   
			close = close_led(us_1, us_2)
			mic = microphone.lisen()
   
			info = [f"Object close: {close}", f"Microphone: {mic}" ,f"US1: {us_1} cm", f"US2: {us_2} cm"]
			print(info)
			display.display_image(info)

			json_data = {
				"datum": time.strftime("%m-%d %H:%M:%S"),
				"us_1": us_1,
				"us_2": us_2,
				"red": int(close),
				"buzzer": int(mic)
			}
			send_data(json_data)

			CURR += 1
			time.sleep(1)
   
   
		for _ in range(count):
			motor.left()
			us_1 = rakija(ultrasonic.sensor_data(6, 13))
			us_2 = rakija(ultrasonic.sensor_data(26, 19))
   
			close = close_led(us_1, us_2)
			mic = microphone.lisen()
   
			info = [f"Object close: {close}", f"Microphone: {mic}" ,f"US1: {us_1} cm", f"US2: {us_2} cm"]
			print(info)
			display.display_image(info)
   
			json_data = {
				"datum": time.strftime("%m-%d %H:%M:%S"),
				# "datum": time.strftime("%Y-%m-%d %H:%M:%S"),
				"us_1": us_1,
				"us_2": us_2,
				"red": int(close),
				"buzzer": int(mic)
			}
			send_data(json_data)
	

			CURR -= 1
			time.sleep(1)


def setup():
	thread_main = threading.Thread(target=main)
	thread_status = threading.Thread(target=status_led, args=(21,))
	# thread_mic = threading.Thread(target=microphone.lisen)

	# Pokretanje niti
	thread_main.start()
	thread_status.start()
	# thread_mic.start()

	# Main thread čeka dok se druge niti ne završe
	thread_main.join()
	thread_status.join()
	# thread_mic.join()


if __name__ == "__main__":
	try:
		setup()
	finally:
		if CURR > 0:
			for i in range(CURR):
				motor.left()
				time.sleep(0.5)
		else:
			for i in range(abs(CURR)):
				motor.right()
				time.sleep(0.5)
		display.clear_screen()
		GPIO.cleanup()


"""
2 LEDs
2 Ultrasonics
Motor
Buzzer
OLED Display
Microphone
"""