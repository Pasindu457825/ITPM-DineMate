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
  tables: {
    type: Array,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isEnabled: {
    type: Boolean,
    default: true  // Default setting for new restaurants to be enabled
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Restaurant", restaurantSchema);