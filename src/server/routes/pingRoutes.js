const express = require('express');
const ping = require('ping');
const router = express.Router();

// Ping API Route
router.post('/ping', async (req, res) => {
  const { ipRange } = req.body;

  console.log('Received IP Range:', ipRange);

  if (!ipRange || !Array.isArray(ipRange)) {
    return res.status(400).json({ error: "Invalid or missing 'ipRange' parameter" });
  }

  const results = {};

  for (const ip of ipRange) {
    try {
      const response = await ping.promise.probe(ip);
      results[ip] = response.alive ? 'Alive' : 'Unreachable';
    } catch (err) {
      results[ip] = 'Error';
    }
  }

  res.json(results);
});

module.exports = router;
