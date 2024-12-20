const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();
const path = require('path');

router.post('/', (req, res) => {
  const { deviceIP, devicePort } = req.body;
  if (!deviceIP || !devicePort) {
    return res.status(400).json({ error: "Missing deviceIP or devicePort" });
  }

  const bellFile = path.join(__dirname, '../assets/bell-chime.wav');

  const args = [
    "-re", 
    "-i", bellFile,
    "-ac", "1",
    "-ar", "16000",
    "-acodec", "g722",
    "-f", "rtp",
    `rtp://${deviceIP}:${devicePort}`
  ];

  console.log(`Sending bell sound to ${deviceIP}:${devicePort} using ffmpeg...`);

  const ffmpegProcess = spawn('ffmpeg', args);

  ffmpegProcess.stderr.on('data', (data) => {
    console.log(`ffmpeg stderr: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg process exited with code ${code}`);
  });

  // Respond immediately to the request
  res.json({ message: 'Sending bell sound to device...' });
});

module.exports = router;
