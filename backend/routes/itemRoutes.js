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


// Get one item by ID
router.get('/display-items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id); // Using Mongoose's findById method
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item); // Return the item data as JSON
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get all items
router.get("/display-items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update item route
router.put('/update-item/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    // Find the item by its ID and update it
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { name, description, price }, // Fields to update
      { new: true } // Returns the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(updatedItem); // Return the updated item
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item route
router.delete('/delete-item/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the item by its ID
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
