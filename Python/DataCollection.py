# coding=utf-8
import Adafruit_DHT
import time
from time import gmtime, strftime
import firebase_admin
from firebase_admin import auth, credentials, db, storage

name = "Blomst3a1"
previousMillis = 0
interval = 5*60000
score = 0
level = 1
CO2 = 0
temperature = 0


def calculateScore(temperature, CO2):
    if (temperature < 25 and temperature > 20 and temperature != 0):
        score = score + 1
    if (temperature > 25 and temperature < 20 and temperature != 0):
        score = score - 1

    if (CO2 < 40 and CO2 != 0):
        score = score + 1
    if (CO2 > 40):
        score = score - 1

    if (score < 0):
        score = 0

    if (score >= 50 + level*50):
        level = level + 1
        score = 0
    return score


def updateDatabase(score, temperature, humidity):
    # Update database
    klient.child(strftime("%Y%m%d%H%M%S", gmtime())).set({
        'temperature': temperature,
        'humidity': humidity,
        'score': score
    })


# Sensor type and pin
sensor = Adafruit_DHT.DHT11
pin = 2

# hvor credentials er auth og credentials er til at administrere brugere,
# db og storage er til at administrere queries og data på databasenself.
creds = credentials.Certificate('Data/Creds.json')
bruger = firebase_admin.initialize_app(creds, {'databaseURL': 'https://test-454bb.firebaseio.com'})

root = db.reference()
# Tilføjer ny blomst hvis ikke den eksisterer i forvejen.
klient = root.child(name)

while True:  # Uendeligt loop som opdaterer databasen hvert femte minut (5 * 3600 sekunder)
    millis = int(round(time.time() * 1000))

    # Måling af temp og humid
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    print('Temp={}*C  Humidity={}%'.format(temperature, humidity))

    if (millis - previousMillis >= interval):
        previousMillisUpdate = millis
        score = calculateScore(temperature, CO2)
        updateDatabase(score, temperature, humidity)
