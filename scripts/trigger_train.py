#!/usr/bin/python

import requests
import time
import json
import random

URL = 'http://localhost:8000/prediction'

TEMP_THRESHOLD = 17
HUMIDITY_THRESHOLD = 60
RAIN_THRESHOLD = 30
WINDSPEED_THRESHOLD = 40

ITEMS = []

for n in range(0, 10):
  for i in range(-50, 50):
    threshold = TEMP_THRESHOLD

    rain = random.randint(0, 1)
    windspeed = random.randint(0, 100)
    humidity = random.randint(0, 100)

    if rain == 1:
      threshold = RAIN_THRESHOLD

    if windspeed > WINDSPEED_THRESHOLD:
      threshold = threshold + 5

    if humidity > HUMIDITY_THRESHOLD:
      threshold = threshold - 5

    result = 1

    if i >= threshold:
      result = 0;

    data = {
      "temperature": i,
      "windspeed": windspeed,
      "rain": rain,
      "humidity": humidity,
      "result": result
    }

    ITEMS.append(data)

print json.dumps(ITEMS)
