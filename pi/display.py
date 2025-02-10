import time
import board
# import gpiozero
import RPi.GPIO as GPIO

from PIL import Image, ImageDraw, ImageFont
import adafruit_ssd1306

# Use gpiozero to control the reset pin
# oled_reset_pin = gpiozero.OutputDevice(4, active_high=False)  # GPIO 4 for reset, active low

RESET_PIN = 4
GPIO.setmode(GPIO.BCM)
GPIO.setup(RESET_PIN, GPIO.OUT)

global draw, oled

# Display Parameters
WIDTH = 128
HEIGHT = 64
BORDER = 5

# Display Refresh
LOOPTIME = 1.0

# Use I2C for communication
i2c = board.I2C()

# Manually reset the display (high -> low -> high for reset pulse)

def reset_oled():
    GPIO.output(RESET_PIN, GPIO.LOW) 
    time.sleep(0.1)  # Čekanje 100ms
    GPIO.output(RESET_PIN, GPIO.HIGH)  

reset_oled()
reset_oled()
reset_oled()
# oled_reset_pin.on()
# time.sleep(0.1)  # Delay for a brief moment
# oled_reset_pin.off()  # Toggle reset pin low
# time.sleep(0.1)  # Wait for reset
# oled_reset_pin.on()  # Turn reset pin back high

# Create the OLED display object
oled = adafruit_ssd1306.SSD1306_I2C(WIDTH, HEIGHT, i2c, addr=0x3C)
# oled = adafruit_ssd1306.SSD1306_128_64(WIDTH, HEIGHT, i2c, addr=0x3C)

# Clear the display
oled.fill(0)
oled.show()

# Create a blank image for drawing
image = Image.new("1", (oled.width, oled.height))

# Get drawing object to draw on image
draw = ImageDraw.Draw(image)

# Draw a white background
draw.rectangle((0, 0, oled.width, oled.height), outline=0, fill=0)

# font = ImageFont.truetype('PixelOperator.ttf', 16)
font = ImageFont.load_default()

def display_image(array):
	draw.rectangle((0, 0, oled.width, oled.height), outline=0, fill=0)

	# draw.rectangle((0, 0, oled.width, oled.height), outline=0, fill=0)
	a = 0
	for i in array:
		draw.text((0, a), i, font=font, fill=255)
		a += 16	
	# draw.text((0, 16), "Heading Angle = 359°", font=font, fill=255)
	
	# Display the image
	oled.image(image)
	oled.show()
 
def clear_screen():
	# oled.clear()

	oled.poweroff()
