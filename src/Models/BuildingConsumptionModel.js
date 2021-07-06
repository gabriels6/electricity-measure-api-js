const mongoose = require('mongoose');

const BuildingConsumptionModel = new mongoose.Schema({
    House_id: String,
    Last_measure_date: Date,
    Consumption_limit: Number,
    Last_measure: Number,
    Wattage: Number
});

module.exports = mongoose.model('Buildings',BuildingConsumptionModel);