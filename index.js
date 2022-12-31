import  express from 'express'
import mariadb from 'mariadb'
import {Server} from 'socket.io'
import mqtt from 'mqtt'
import http from 'http'
import dateFormat from 'dateformat'
const app = express()

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin: '*'
    }
})

async function asyncConnection() {
    
    const conn = mariadb.createConnection({
        host: '4.227.201.55', 
        user:'iot', 
        password: 'beesiot2022',
        database: 'iot',
        multipleStatements: true
    });
    return conn;
}
let conn = await asyncConnection()
var init_db_1 =
    "CREATE TABLE IF NOT EXISTS pos (longitude FLOAT, latitude FLOAT, stamp TEXT);"
var init_db_2 =
    "CREATE TABLE IF NOT EXISTS temperature (value FLOAT,stamp TEXT);"
var init_db_3 =
    "CREATE TABLE IF NOT EXISTS sound (value FLOAT,stamp TEXT);"
var init_db_4 =
    "CREATE TABLE IF NOT EXISTS vibration (value FLOAT,stamp TEXT);"
var init_db_5 =
    "CREATE TABLE IF NOT EXISTS humidity (value FLOAT,stamp TEXT);"
var init_db_6 =
    "CREATE TABLE IF NOT EXISTS weight (value FLOAT,stamp TEXT);"
var init_db_7 =
    "CREATE TABLE IF NOT EXISTS count (value FLOAT,stamp TEXT);"
var init =conn.query(init_db_1,init_db_2,init_db_3,init_db_4,init_db_5,init_db_6,init_db_7)
const insertPos= ((data)=>{
    let day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    let insert = conn.query("INSERT INTO pos(longitude,latidude,stamp) VALUES ('"+data.long+"','"+data.lat+"','"+day+"')")
})
io.on('connection', (socket) => {
    console.log('a user connected');
  });

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
        console.log("Something on gps")
        var val = packet.payload.toString()
        val = val.split(",")
        let data ={
            longitude: parseFloat(val[0]),
            latitude: parseFloat(val[1])
        }
        io.emit("location",data)
        insertPos(data)
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