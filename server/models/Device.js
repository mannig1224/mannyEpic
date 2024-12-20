const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  deviceType: { type: String, required: true },
  status: { type: String, required: true },
  IP: { type: String, required: true },
  MAC: { type: String, required: true },
  extension: { type: String, required: true },
}, { collection: 'devices' });

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
