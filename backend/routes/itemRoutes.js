const express = require('express');
const Item = require('../models/itemModel'); // Assuming you have an itemModel.js file
const router = express.Router();

router.post('/add-item', async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: 'All fields are required' }); // Ensure all fields are sent
  }

  try {
    const newItem = new Item({ name, description, price });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    console.error('Error in adding item:', error);  // Add detailed logging
    res.status(500).json({ message: 'Error adding item', error: error.message });
  }
});

module.exports = router;
