const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  foodId: {
    type: String,
    required: true,
    unique: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
