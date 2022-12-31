from paho.mqtt import client as mqtt_client
import random
import time
broker = '20.230.9.95'
port = 1883
topic = "python/mqtt"
client_id = "python-mqtt-testing"
username = 'beesiot2022'
password = 'beesiot2022'

topicWeight = "/bees/weight" 
topicTemp = '/bees/temp' 
topicOut = '/bees/out' 
topicIn = '/bees/in' 
topicGPS = '/bees/gps' 
topicHumidity = '/bees/humidity' 
topicSound = '/bees/sound' 
topicVibration = '/bees/vibration' 

def testWeight(client):
    try:
        client.publish(topicWeight,"1000")
    except:
        return False
    return True
def testTemp(client):
    try:
        client.publish(topicTemp,"32.4")
    except:
        return False
    return True
def testLocation(client):
    try:
        client.publish(topicGPS,"-71.13780102934031,-34.939608584392055")
        print("LOCATION SENDED")
    except:
        return False
    return True
def on_connect(client, userdata, flags, rc):

        if rc == 0:
            print("Connected to MQTT Broker!")
            return
        
        print("Failed to connect, return code %d\n", rc)

    
# Set Connecting Client ID
client = mqtt_client.Client(client_id)
client.username_pw_set(username, password)
client.on_connect = on_connect
client.connect(broker, port=port)
client.loop_start()


client.subscribe(topicWeight)
client.subscribe(topicTemp)
client.subscribe(topicGPS)
while True:
    testWeight(client)
    testTemp(client)
    testLocation(client)
    time.sleep(1000)


 
testLocation(client)
 
