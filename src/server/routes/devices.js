const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// GET all devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    console.log('Fetched devices:', devices); // Log result for debugging 
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error });
  }
});

// POST a new device
router.post('/', async (req, res) => {
  try {
    const { name, ip, status } = req.body; // Extract data from the request body
    const newDevice = new Device({ name, ip, status }); // Create a new document
    await newDevice.save(); // Save it to the database
    res.status(201).json(newDevice); // Respond with the created device
  } catch (error) {
    res.status(400).json({ message: 'Error saving device', error });
  }
});

// GET a device by ID
router.get('/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id); // Find a device by ID
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching device', error });
  }
});

// PUT to update a device by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the updated document
    );
    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(updatedDevice);
  } catch (error) {
    res.status(400).json({ message: 'Error updating device', error });
  }
});

// DELETE a device by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedDevice = await Device.findByIdAndDelete(req.params.id); // Delete a device by ID
    if (!deletedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device', error });
  }
});

// Catch-all for invalid routes
router.all('*', (req, res) => {
  res.status(404).json({ message: 'Invalid route. Please check the API endpoint.' });
});

module.exports = router;
