import * as mqtt from "mqtt"

export default class ClientMqtt{

    constructor(url,props){
      let client = mqtt.connect(url,{
        user:props.username,
        password: props.password
      });
     
      client.on('connect', function () {
        console.log("connected  "+ client.connected);
        client.subscribe('/bees', function (err) {
          console.log("Subscribed to top ")
          if (!err) {
            client.publish('/bees', 'Hello mqtt')
          }
        })
      })
      
      
      client.on('message', function (topic, message) {
        // message is Buffer
        console.log(topic.toString+":"+message.toString())
      })
    }

}