const cron = require('node-cron');

cron.schedule('*/3 * * * * *', async () => {
  try {
    const { default: fetch } = await import('node-fetch');
    console.log('Pinging devices at:', new Date().toISOString());
    const response = await fetch('http://localhost:5000/api/pingAllDevices');
    const data = await response.json();
    console.log('Ping results:', data);
  } catch (error) {
    console.error('Error calling pingAllDevices:', error);
  }
});
