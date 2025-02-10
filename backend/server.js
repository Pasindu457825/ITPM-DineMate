const express = require('express');
const connectDB = require('./config/db'); // Make sure the path is correct

const app = express();

// Connect to MongoDB
connectDB();

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
