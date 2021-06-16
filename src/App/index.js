require('dotenv').config({path: __dirname + '/.env'});

const mqtt = require("mqtt");
const client = mqtt.connect("ws://scout-mqtt-broker.herokuapp.com");
const cors = require("cors");
const express = require("express");
const { Router } = require("express");
const mongoose = require('mongoose');

const WattageDeviceModel = require("../Models/WattageDeviceModel");

const routes = Router();

let wattage = 0

const config = {
    url:'mongodb+srv://'+process.env.user+':'+process.env.pass+'@cluster-test.q4jsk.gcp.mongodb.net/'+process.env.database+'?retryWrites=true&w=majority'
}

mongoose.connect(config.url,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true 
    }
);

routes.get("/iot/elec",(req,res) => {
    return res.json({
        Wattage:wattage
    });
});

routes.get("/iot/elec/devices", async(req,res) => {
    return res.json(await WattageDeviceModel.find());
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

    client.subscribe("/iot/elec/save", (err) => {
    });

    client.subscribe("/iot/elec/update", (err) => {
    });
});

client.on("message", async (topic,message) => {
    if(topic.toString() === "/iot/elec"){
        wattage = parseInt(message.toString());
    }
    if(topic.toString() === "/iot/elec/save"){
        const { Wattage, Device } = JSON.parse(message.toString());

        if (await WattageDeviceModel.findOne({Device_id:Device}) !== null){
            return;
        }


        await WattageDeviceModel.create({
            Wattage:Wattage,
            Device_id:Device
        });
    }
    if(topic.toString() === "/iot/elec/update"){
        const { Wattage, Device } = JSON.parse(message.toString());

        if (await WattageDeviceModel.findOne({Device_id:Device}) === null) return;

        await WattageDeviceModel.updateOne({Device_id:Device},{Wattage:Wattage});
    }
});

app.listen(process.env.PORT || 3333);
