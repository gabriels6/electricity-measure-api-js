const mongoose = require('mongoose');

const WattageDeviceSchema = new mongoose.Schema({
    Device_id: String,
    Wattage: Number
});

module.exports = mongoose.model('Wattage_Measures',WattageDeviceSchema);