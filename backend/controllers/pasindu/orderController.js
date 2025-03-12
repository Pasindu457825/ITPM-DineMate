// controllers/orderController.js
const Order = require("../../models/pasindu/orderModel"); // Assuming you have the correct path

// Add new order
const createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      customerName,
      customerEmail,
      orderType,
      paymentStatus,
      orderStatus,
      total,
      items,
      reservationStatus,
    } = req.body;

    if (
      !restaurantId ||
      !customerName ||
      !customerEmail ||
      !orderType ||
      !paymentStatus ||
      !orderStatus
    ) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const orderId = `ORD-${Date.now()}`;

    const newOrder = new Order({
      restaurantId,
      orderId,
      customerName,
      customerEmail,
      orderType,
      paymentStatus,
      orderStatus,
      total,
      items,
      reservationStatus,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order added successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res
      .status(500)
      .json({ message: "Error adding order", error: error.message });
  }
};

// Get one order by ID
const getOrderById = async (req, res) => {
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
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    orderId,
    customerName,
    customerEmail,
    orderType,
    paymentStatus,
    orderStatus,
    total,
    items,
    reservationStatus,
  } = req.body;

  try {
    // Find the order by its ID and update it
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderId,
        customerName,
        customerEmail,
        orderType,
        paymentStatus,
        orderStatus,
        total,
        items,
        reservationStatus,
      }, // Fields to update
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder); // Return the updated order
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the order by its ID
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrder,
  deleteOrder,
};
