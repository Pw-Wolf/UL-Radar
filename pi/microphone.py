import RPi.GPIO as GPIO
import time

mic = 12
buzzer = 16
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

GPIO.setup(mic,GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(buzzer,GPIO.OUT) 
  
def lisen():
	sound = GPIO.input(mic)
	if sound:
		GPIO.output(buzzer, GPIO.HIGH)
		return True
	GPIO.output(buzzer, GPIO.LOW)
	return False

if __name__ == "__main__":
	while True:
		lisen()
		time.sleep(0.5)