# coding=utf-8
import Adafruit_DHT
import time
from time import gmtime, strftime
import firebase_admin
from firebase_admin import auth, credentials, db, storage

previousMillis = 0;
interval = 5*60000;
score = 0;
level = 1;

# Sensor type and pin
sensor = Adafruit_DHT.DHT11
pin = 2

# hvor credentials er auth og credentials er til at administrere brugere,
#db og storage er til at administrere queries og data på databasenself.
creds = credentials.Certificate('data/creds.json')
bruger = firebase_admin.initialize_app(creds, {'databaseURL' : 'https://test-454bb.firebaseio.com'})

root = db.reference()
# Tilføjer ny blomst hvis ikke den eksisterer i forvejen.
klient = root.child("blomst0")

while True: # Uendeligt loop som opdaterer databasen hvert femte minut (5 * 3600 sekunder)
    millis = int(round(time.time() * 1000))

    #Make messurement
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    print('Temp={}*C  Humidity={}%'.format(temperature, humidity))

    if (millis - previousMillis >= interval):
        previousMillisUpdate = millis
        updateDatabase(calculateScore(temperature, humidity), temperature, humidity)

def calculateScore (temperature, humidity):
    if (temperature<25 and temperature > 20):
        score = score +1
        if (score >= 100):
            level = 2

    elif(temperature > 25 or temperature < 20):
        score = score -1
        if(level == 2 and score < 100):
            score = 100

def updateDatabase(score, temperature, humidity):
    #Update database
    klient.child(strftime("%Y%m%d%H%M%S", gmtime())).set({
        'temperature' : temperature,
        'humidity' : humidity,
        'score' : score
            })
