// controllers/itemController.js
const Item = require("../../models/itemModel"); // Going up two directories

const addItem = async (req, res) => {
  const { name, price, description } = req.body;

  try {
    const newItem = new Item({
      name,
      price,
      description,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Error adding item", error });
  }
};

module.exports = {
  addItem,
};
