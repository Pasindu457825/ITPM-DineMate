const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  numberOfTables: {
    type: Number,
    required: true,
  },
  seatsPerTable: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
