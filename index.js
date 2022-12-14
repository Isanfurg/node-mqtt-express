const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
  });
var mqtt    = require('mqtt');
const url= "20.230.9.95:1883"
const props ={
username: "beesiot2022",
password: "beesiot2022"
}
const topicName = '/bees/weight' 

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
  if(topic === topicName) { 

   io.emit("weight", packet.payload.toString())
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