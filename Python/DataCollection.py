# coding=utf-8
import Adafruit_DHT
import time
from time import gmtime, strftime
import firebase_admin
from firebase_admin import auth, credentials, db, storage

name = "3a1"
score = 0
level = 1
CO2 = 0

# Sensor type og pin den er forbundet til
sensor = Adafruit_DHT.DHT11
pin = 2

# Credentials til firebase,
# hvor credentials er auth og credentials er til at administrere brugere,
# db og storage er til at administrere queries og data på databasenself.
creds = credentials.Certificate('Data/Creds.json')
user = firebase_admin.initialize_app(creds, {'databaseURL': 'https://test-454bb.firebaseio.com'})

root = db.reference()
# Tilføjer ny blomst hvis ikke den eksisterer i forvejen.
client = root.child(name)

snapshot = client.order_by_key().limit_to_last(1).get()
for key, val in snapshot.items():
    level = val.get("level")
    score = val.get("score")

print(level, score)


def calculateChange(temperature, CO2):  # Funktion - skal scoren ændres?
    change = 0
    if (temperature <= 25 and temperature > 20 and temperature != 0):
        change = change + 1
    if (temperature > 25 or temperature < 20 and temperature != 0):
        change = change - 1

    if (CO2 < 40 and CO2 != 0):
        change = change + 1
    if (CO2 > 40):
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
    # Måling af temp og humid
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

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
