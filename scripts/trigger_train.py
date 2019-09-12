#!/usr/bin/python

import requests
import time
import json
import random

URL = 'http://localhost:8000/prediction'

TEMP_THRESHOLD = 19
HUMIDITY_THRESHOLD = 60
RAIN_THRESHOLD = 28
WINDSPEED_THRESHOLD = 40

ITEMS = []

for n in range(0, 100):
  for i in range(-50, 50):
    threshold = TEMP_THRESHOLD

    rain = random.randint(0, 1)
    windspeed = random.randint(0, 100)
    humidity = random.randint(0, 100)
    tolerance = random.randint(1, 4);
    activity = random.randint(1, 3);

    if rain == 1:
      threshold = RAIN_THRESHOLD

    if windspeed > WINDSPEED_THRESHOLD:
      wind_adjustment = (windspeed - WINDSPEED_THRESHOLD) / 10;
      threshold = threshold + wind_adjustment

    if humidity > HUMIDITY_THRESHOLD:
      humidity_adjustment = (humidity - HUMIDITY_THRESHOLD) / 10;
      threshold = threshold - humidity_adjustment

    # don't like the cold
    if tolerance == 1:
      threshold = threshold + 2
    
    # neutral
    elif tolerance == 2:
      threshold = threshold + 0

    # don't mind the cold
    elif tolerance == 3:
      threshold = threshold - 2
    
    # su]er human
    elif tolerance == 4:
      threshold = -50

    if activity > 1:
      threshold = threshold - activity

    result = 1

    if i >= threshold:
      result = 0;

    data = {
      "temperature": i,
      "windspeed": windspeed,
      "rain": rain,
      "humidity": humidity,
      "result": result,
      "tolerance": tolerance,
      "activity": activity
    }

    ITEMS.append(data)

print json.dumps(ITEMS)
