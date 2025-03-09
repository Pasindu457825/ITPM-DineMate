const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  numberOfTables: { type: Number, required: true },
  seatsPerTable: { type: Number, required: true },
  image: { type: String, required: true },
});

// ✅ MongoDB will automatically generate `_id`
// ✅ No `restaurantId` field blocking multiple entries
module.exports = mongoose.model("Restaurant", RestaurantSchema);
