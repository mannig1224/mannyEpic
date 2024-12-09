const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pingRoutes = require('./routes/pingRoutes');

const app = express();
const PORT = 5000; // Choose a port for your backend

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', pingRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
