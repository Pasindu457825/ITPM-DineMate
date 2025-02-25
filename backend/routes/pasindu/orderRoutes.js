const express = require('express');
const Order = require('../../models/pasindu/orderModel'); // Assuming you have an orderModel.js file
const router = express.Router();

router.post('/add-order', async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: 'All fields are required' }); // Ensure all fields are sent
  }

  try {
    const newOrder = new Order({ name, description, price });
    await newOrder.save();
    res.status(201).json({ message: 'Order added successfully', order: newOrder });
  } catch (error) {
    console.error('Error in adding order:', error);  // Add detailed logging
    res.status(500).json({ message: 'Error adding order', error: error.message });
  }
});


// Get one order by ID
router.get('/display-orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id); // Using Mongoose's findById method
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order); // Return the order data as JSON
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get all orders
router.get("/display-orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order route
router.put('/update-order/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    // Find the order by its ID and update it
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { name, description, price }, // Fields to update
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder); // Return the updated order
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete order route
router.delete('/delete-order/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the order by its ID
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
