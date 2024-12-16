const express = require('express');
const devicesRoute = require("./routes/devices");
const bodyParser = require('body-parser');
const cors = require('cors');
const pingRoutes = require('./routes/pingRoutes');
const connectToDatabase = require('./routes/mongodb');

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
app.use('/api', pingRoutes);
app.use("/api/devices", devicesRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
