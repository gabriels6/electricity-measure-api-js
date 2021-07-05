const { Router } = require("express");
const WattageDeviceModel = require("../Models/WattageDeviceModel");
const BuildingConsumptionModel = require('../Models/BuildingConsumptionModel');

const routes = Router();

routes.get("/iot/elec/buildings", async (req,res) => {

    return res.json(await BuildingConsumptionModel.find());

});

routes.get("/iot/elec/building/:Building_id", async (req,res) => {

    const params = req.params;

    return res.json(await BuildingConsumptionModel.findOne({
        House_id:params.Building_id,
    }));
});

routes.get("/iot/elec/devices", async(req,res) => {
    return res.json(await WattageDeviceModel.find());
});

routes.get("/iot/elec/devices/:Device_id",async (req, res) => {
    const params = req.params;

    return res.json(await WattageDeviceModel.findOne({Device_id:params.Device_id}));
});

module.exports = routes;