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
const topicTemp = '/bees/weight' 
const topicOut = '/bees/weight' 
const topicIn = '/bees/weight' 
const topicGPS = '/bees/weight' 
const topicHumidity = '/bees/weight' 
const topicSound = '/bees/weight' 
const topicVibration = '/bees/weight' 


const client = mqtt.connect("mqtt://"+url,props) 
client.on('connect', ()=> { 
    // can also accept objects in the form {'topic': qos} 
  client.subscribe(topicName, (err, granted) => { 
      if(err) { 
          console.log(err, 'err'); 
      } 
      console.log(granted, 'granted') 
  }) 
}) 


// on receive message event, log the message to the console 
client.on('message', (topic, message, packet) => { 
  console.log(packet, packet.payload.toString()); 
  
  switch (topic) {
    case topicWeight:
        var val = packet.payload.toString()
        io.emit("weight",{
            weight: parseFloat(val)
        })
        break;
    case topicHumidity:
        var val = packet.payload.toString()
        io.emit("humidity",{
            humidity: parseFloat(val)
        })
        break
    case topicSound:
        var val = packet.payload.toString()
        io.emit("sound",{
            sound: parseFloat(val)
        })
        break
    case topicGPS:
        var val = packet.payload.toString()
        val = val.split(",")
        io.emit("sound",{
            longitude: parseFloat(val[0]),
            latitude: parseFloat(val[1])
        })
        break
    case topicVibration:
        var val = packet.payload.toString()
        io.emit("vibration",{
           vibration: parseFloat(val)
        })
        break
    case topicTemp:
        var val = packet.payload.toString()
        io.emit("temperature",{
            temperature: parseFloat(val)
        })
        break
    case topicIn:
        var val = packet.payload.toString()
        io.emit("addBee",{
            //no se que enviar
        })
        break
    case topicOut:
        var val = packet.payload.toString()
        io.emit("removeBee",{
            //no se que enviar
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