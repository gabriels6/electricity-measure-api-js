const mqtt = require("mqtt");
const client = mqtt.connect("ws://scout-mqtt-broker.herokuapp.com");
const cors = require("cors");
const express = require("express");
const { Router } = require("express");

const routes = Router();

let wattage = 0

routes.get("/iot/elec",(req,res) => {
    return res.json({
        Wattage:wattage
    });
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

client.on("connect", () => {
    client.subscribe("presence", (err) => {
        if(!err) {
            client.publish("presence","Hello mqtt");
        }
    });
    client.subscribe("/iot/elec", (err) => {
        if(!err) {
            client.publish("/iot/elec","Listening to wattage values");
        }
    })
});

client.on("message", (topic,message) => {
    if(topic.toString() === "/iot/elec"){
        wattage = parseInt(message.toString());
    }
});

app.listen(process.env.PORT || 3333);
