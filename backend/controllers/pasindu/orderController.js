// controllers/orderController.js
const Order = require("../../models/pasindu/orderModel"); // Going up two directories

const addOrder = async (req, res) => {
  const { name, price, description } = req.body;

  try {
    const newOrder = new Order({
      name,
      price,
      description,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order added successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Error adding order", error });
  }
};

module.exports = {
  addOrder,
};
