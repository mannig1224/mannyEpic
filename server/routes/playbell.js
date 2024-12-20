const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');

// POST route to play a bell sound on a target device using ffmpeg
router.post('/play-bell', async (req, res) => {
  try {
    const { deviceIP, devicePort } = req.body;
    if (!deviceIP || !devicePort) {
      return res.status(400).json({ error: "Missing deviceIP or devicePort" });
    }

    // Path to your bell sound file
    const bellFile = '../assets/bell-chime.wav'; // Update to your actual file path

    const args = [
        "-re",   // Real-time input
        "-i", bellFile,         // Input file
        "-ac", "1",             // Mono audio
        "-ar", "16000",         // Sample rate: 16 kHz
        "-acodec", "g722",      // Audio codec: G.722
        "-f", "rtp",            // RTP output format
        `rtp://${deviceIP}:${devicePort}` // Destination: device IP & port
      ];

    console.log(`Sending bell sound to ${deviceIP}:${devicePort} using ffmpeg...`);

    // Spawn ffmpeg process
    const ffmpegProcess = spawn('ffmpeg', args);

    ffmpegProcess.stderr.on('data', (data) => {
      console.log(`ffmpeg stderr: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
      console.log(`ffmpeg process exited with code ${code}`);
      // If needed, you can handle the completion event here.
    });

    // Immediately respond to the request while ffmpeg runs in the background.
    // Depending on your use case, you might wait until ffmpeg finishes to respond.
    res.json({ message: 'Sending bell sound to device...' });
  } catch (error) {
    console.error('Error sending bell sound:', error);
    res.status(500).json({ error: 'Failed to send bell sound' });
  }
});

module.exports = router;
