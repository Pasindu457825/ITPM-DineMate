const express = require('express');
const app = express();
const cors = require('cors'); // Add this to enable CORS

// Use CORS to allow requests from frontend
app.use(cors());

// Define your API route
app.get('/api/data', (req, res) => {
  const responseData = { message: 'Hello from the backend!' };
  res.json(responseData);
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
