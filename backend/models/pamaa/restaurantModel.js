const mongoose = require("mongoose");

// Define a schema for table configurations
const TableSchema = new mongoose.Schema({
  seats: { type: Number, required: true },  // Number of seats per table
  quantity: { type: Number, required: true } // Quantity of tables with the specified number of seats
});

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  tables: [TableSchema], // Array of table configurations
  image: { type: String, required: true },
});

// MongoDB will automatically generate `_id`
// No `restaurantId` field blocking multiple entries
module.exports = mongoose.model("Restaurant", RestaurantSchema);
