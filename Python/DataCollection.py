# coding=utf-8
import Adafruit_DHT
import time
from time import gmtime, strftime
import firebase_admin
from firebase_admin import auth, credentials, db, storage
from Adafruit_CCS811 import Adafruit_CCS811

name = "3a2"
score = 0
level = 1
CO2 = 0

# Sensor type og pin den er forbundet til
sensor = Adafruit_DHT.DHT11
pin = 4

# Co2 Sensor
ccs = Adafruit_CCS811()
while not ccs.available():
    pass
temp = ccs.calculateTemperature()
ccs.tempOffset = temp - 25.0

# Credentials til firebase
creds = credentials.Certificate('Data/Creds.json')
user = firebase_admin.initialize_app(creds, {'databaseURL': 'https://test-454bb.firebaseio.com'})

root = db.reference()
# Tilføjer ny blomst hvis ikke den eksisterer i forvejen.
client = root.child(name)

# Hent den nyeste kopi af level og score
snapshot = client.order_by_key().limit_to_last(1).get()
if snapshot is not None:
    for key, val in snapshot.items():
        level = val.get("level")
        score = val.get("score")

print(level, score)


def calculateChange(temperature, CO2):  # Funktion - skal scoren ændres?
    change = 0
    if (temperature <= 25 and temperature >= 20 and temperature != 0):
        change = change + 1
    if (temperature > 25 or temperature < 20 and temperature != 0):
        change = change - 1

    if (CO2 < 800 and CO2 != 0):
        change = change + 1
    if (CO2 > 800):
        change = change - 1
    return change


def updateDatabase(score, level, temperature, humidity, change, CO2):  # Funtion opdaterer database.
    # Update database
    client.child(strftime("%Y%m%d%H%M%S", gmtime())).set({
        'temperature': temperature,
        'humidity': humidity,
        'score': score,
        'level': level,
        'change': change,
        'CO2': CO2
    })


while True:  # Uendeligt loop som opdaterer databasen hvert femte minut (5 * 3600 sekunder)

    try:
        # Måling af temp og humid
        humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

        # Læser Co2 niveau
        if ccs.available():
            temp = ccs.calculateTemperature()
            if not ccs.readData():
                CO2 = ccs.geteCO2()
                print "CO2: ", ccs.geteCO2(), "ppm, TVOC: ", ccs.getTVOC(), " temp: ", temp
            else:
                print "ERROR!"
                while(1):
                    pass

        # Beregn level og nulstil score
        change = calculateChange(temperature, CO2)
        score = score + change
        if (score < 0):
            score = 0
        if (score >= 50 + level * 50):
            level = level + 1
            score = 0

        updateDatabase(score, level, temperature, humidity, change, CO2)
        print('Temp={}*C  Humidity={}%  Level={}  Score={}  Change={}  CO2={}'.format(temperature,
                                                                                      humidity, level, score, change, CO2))
        time.sleep(5)
    except Exception as e:
        print(e)
        time.sleep(60)
