const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    required: true,
  },
  restaurantName: {
    type: String,
    required: true, // ✅ Ensures food items are linked to a restaurant name
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
  
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
