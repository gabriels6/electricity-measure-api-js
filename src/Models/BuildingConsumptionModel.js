const mongoose = require('mongoose');

const BuildingConsumptionModel = new mongoose.Schema({
    House_id: String,
    Wattage: Number
});

module.exports = mongoose.model('Buildings',BuildingConsumptionModel);