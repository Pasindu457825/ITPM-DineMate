// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/pasindu/orderController'); // Path to your controller file

// Add new order
router.post('/add-order', orderController.addOrder);

// Get one order by ID
router.get('/display-orders/:id', orderController.getOrderById);

// Get all orders
router.get("/display-orders", orderController.getAllOrders);

// Update order route
router.put('/update-order/:id', orderController.updateOrder);

// Delete order route
router.delete('/delete-order/:id', orderController.deleteOrder);

module.exports = router;
