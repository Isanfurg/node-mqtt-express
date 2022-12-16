const express = require('express')
    
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server,{
    cors:{
        origin: '*'
    }
})

io.on('connection', (socket) => {
    console.log('a user connected');
  });
var mqtt    = require('mqtt');
const url= "20.230.9.95:1883"
const props ={
username: "beesiot2022",
password: "beesiot2022"
}
const topicWeight = '/bees/weight' 
const topicTemp = '/bees/temp' 
const topicOut = '/bees/out' 
const topicIn = '/bees/in' 
const topicGPS = '/bees/gps' 
const topicHumidity = '/bees/humidity' 
const topicSound = '/bees/sound' 
const topicVibration = '/bees/vibration' 
var count = 3000

const client = mqtt.connect("mqtt://"+url,props) 
client.on('connect', ()=> { 
    // can also accept objects in the form {'topic': qos} 
  client.subscribe(topicWeight)
  client.subscribe(topicTemp)
  client.subscribe(topicOut)
  client.subscribe(topicIn)
  client.subscribe(topicGPS)
  client.subscribe(topicVibration)
  client.subscribe(topicSound) 
  client.subscribe(topicHumidity)

}) 


// on receive message event, log the message to the console 
client.on('message', (topic, message, packet) => { 
  console.log(packet, packet.payload.toString()); 
  
  switch (topic) {
    case topicWeight:
        var val = packet.payload.toString()
        io.emit("weight",{
            value: parseFloat(val)
        })
        break;
    case topicHumidity:
        var val = packet.payload.toString()
        io.emit("humidity",{
            value: parseFloat(val)
        })
        break
    case topicSound:
        var val = packet.payload.toString()
        io.emit("sound",{
            value: parseFloat(val)
        })
        break
    case topicGPS:
        var val = packet.payload.toString()
        val = val.split(",")
        io.emit("location",{
            longitude: parseFloat(val[0]),
            latitude: parseFloat(val[1])
        })
        break
    case topicVibration:
        var val = packet.payload.toString()
        io.emit("vibration",{
           value: parseFloat(val)
        })
        break
    case topicTemp:
        var val = packet.payload.toString()
        io.emit("temperature",{
            value: parseFloat(val)
        })
        break
    case topicIn:
        io.emit("count",{
            value: count++
        })
        break
    case topicOut:
        
        io.emit("count",{
            value: count--
        })
        break
    default:
        break;
  }
  
}) 
client.on("packetsend", (packet) => { 
    console.log(packet, 'Connection alive'); 
}) 
client.on("reconnect", function() { 
    console.log("Client trying a reconnection") 
}) 

client.on("offline", function() { 
    console.log("Client is currently offline") 
})  
server.listen(3000);