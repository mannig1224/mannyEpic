const express = require('express');
const ping = require('ping');
const router = express.Router();
const Device = require('../models/Device'); // Make sure this path is correct

// Route to ping all devices and update their statuses
router.get('/', async (req, res) => {
  try {
    // Fetch all devices from the database
    const devices = await Device.find({});

    // If no devices found, send an appropriate response
    if (!devices.length) {
      return res.status(404).json({ message: 'No devices found' });
    }

    const pingResults = {};

    // Create an array of promises, each promise pings a device and updates its status.
    const pingPromises = devices.map(async (device) => {
      const response = await ping.promise.probe(device.IP);
      const newStatus = response.alive ? 'Alive' : 'Unreachable';

      // Update the device in the database
      await Device.findByIdAndUpdate(device._id, { status: newStatus }, { new: true });

      // Store result
      pingResults[device.IP] = newStatus;
    });

    // Wait for all pings and updates to complete
    await Promise.all(pingPromises);

    // Return a summary of the ping results
    res.json({ message: 'All device statuses updated', pingResults });

  } catch (error) {
    console.error('Error pinging devices:', error);
    res.status(500).json({ error: 'Failed to ping and update devices' });
  }
});

module.exports = router;