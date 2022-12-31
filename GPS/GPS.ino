#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Change the credentials below, so your ESP8266 connects to your router
const char* ssid = "Telematica";
const char* password = "telematica.2022";
// Change the variable to your Raspberry Pi IP address, so it connects to your MQTT broker
const char* mqtt_server = "20.230.9.95";
const int port = 1883;

// Initializes the espClient. You should change the espClient name if you have multiple ESPs running in your home automation system
WiFiClient espClient;
PubSubClient client(espClient);
//credentials mqtt
const char* client_mqtt = "nodeMCU V3";
const char* user_mqtt ="beesiot2022";
const char* pass_mqtt ="beesiot2022";
//topics mqtt
const char* topic_gps = "/bees/gps";
const char* topic_humidity = "/bees/humidity";
const char* topic_sound = "/bees/sound";
const char* topic_vibration = "/bees/vibration";
const char* topic_temp = "/bees/temp";
const char* topic_weight = "/bees/weight";
const char* topic_in = "/bees/in";
const char* topic_out = "/bees/out";
//gps things
const int RxPin = 4, TxPin = 5;// 4 = D2 ; 5 = D1
const int gpsBaud = 9600;
TinyGPSPlus gps;
//GPS serial
SoftwareSerial ss(RxPin, TxPin); 

// Don't change the function below. This functions connects your ESP8266 to your router
void setup_wifi() {
  // We start by connecting to a WiFi network
  WiFi.mode(WIFI_STA);
  delay(2000); 
  Serial.println();
  Serial.print("Connecting to ...");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected - ESP IP address: ");
  Serial.println(WiFi.localIP());
}

// This functions reconnects your ESP8266 to your MQTT broker
// Change the function below if you want to subscribe to more topics with your ESP8266 
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
  
    if (client.connect(client_mqtt,user_mqtt,pass_mqtt)) {
      Serial.println("connected");  
      // Subscribe or resubscribe to a topic
      // You can subscribe to more topics (to control more LEDs in this example)
      client.subscribe(topic_gps);
      client.subscribe(topic_humidity);
      client.subscribe(topic_weight);
      client.subscribe(topic_sound);
      client.subscribe(topic_vibration);
      client.subscribe(topic_temp);
      client.subscribe(topic_in);
      client.subscribe(topic_out);
     
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
void publish_ubication(float latitude,float longitude){
  String gpsString ="";  //make sure the string is empty if its not
  gpsString += latitude;
  gpsString += ",";
  gpsString += longitude;
  Serial.print("Sending: ");
  Serial.println(gpsString);
  client.publish(topic_gps, gpsString.c_str());
}
void publish_humidity(float hum){
  String data ="";  //make sure the string is empty if its not
  data += hum;
  Serial.print("Sending: ");
  Serial.println(data);
  client.publish(topic_humidity, data.c_str());
}
void publish_weight(float weight){
  String data ="";  //make sure the string is empty if its not
  data += weight;
  Serial.print("Sending: ");
  Serial.println(data);
  client.publish(topic_weight, data.c_str());
}
void publish_temp(float temp){
  String data ="";  //make sure the string is empty if its not
  data += temp;
  Serial.print("Sending: ");
  Serial.println(data);
  client.publish(topic_temp, data.c_str());
}

void publish_vibration(float vib){
  String data ="";  //make sure the string is empty if its not
  data += vib;
  Serial.print("Sending: ");
  Serial.println(data);
  client.publish(topic_vibration, data.c_str());
}

void publish_sound(float sound){
  String data ="";  //make sure the string is empty if its not
  data += sound;
  Serial.print("Sending: ");
  Serial.println(data);
  client.publish(topic_sound, data.c_str());
}
void publish_in(){
  String data ="";  //make sure the string is empty if its not
  Serial.print("Sending: ");
  Serial.println(data);
  client.publish(topic_in, data.c_str());
}
void publish_out(){
  String data ="";  //make sure the string is empty if its not
  Serial.print("Sending: ");
  Serial.println(data);
  client.publish(topic_out, data.c_str());
}


void checkGPS(){
  Serial.println(gps.location.lat());
  Serial.println(gps.location.lng());
  
  if(gps.location.isValid()){
    float latitude = (gps.location.lat());     //Storing the Lat. and Lon. 
    float longitude = (gps.location.lng()); 
    publish_ubication(latitude, longitude);
 }
}
// The setup function sets your ESP GPIOs to Outputs, starts the serial communication at a baud rate of 115200
// Sets your mqtt broker and sets the callback function
// The callback function is what receives messages and actually controls the LEDs
void setup() {
  ss.begin(gpsBaud);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, port);

}

// For this project, you don't need to change anything in the loop function. Basically it ensures that you ESP is connected to your broker
void loop() {
  
  if (!client.connected()) {
    reconnect();
  }
  if(!client.loop()){
    client.connect(client_mqtt,user_mqtt,pass_mqtt);
  }
  
  
  //test
   publish_ubication(-34.6916, -71.0281);
   publish_weight(34.6916);
   publish_humidity(4.6916);
   publish_sound(4.6916);
   publish_vibration(4.6916);
   publish_temp(4.6916);
   publish_in();
   publish_in();
   publish_in();
   publish_out();
   
   
  delay(5000);
} 
