const express = require('express');
const devicesRoute = require("./routes/devices");
const bodyParser = require('body-parser');
const cors = require('cors');
const pingAllDevices = require('./routes/pingRoutes');
const playBell = require('./routes/playBell')
const connectToDatabase = require('./routes/mongodb');

require('./cron/pingCron');

const app = express();
const PORT = 5000; // Choose a port for your backend

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
(async () => {
  try {
    await connectToDatabase();
    console.log('Successfully connected to MongoDB with Mongoose!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
})();


// Routes
app.use('/api/pingAllDevices', pingAllDevices);
app.use("/api/devices", devicesRoute);
app.use("/api/playBell", playBell);
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected!" });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
