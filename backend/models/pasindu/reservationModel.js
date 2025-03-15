const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  reservationId: {
    type: String,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  tableNumber: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  NoofPerson: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  specialRequests: {
    type: String, // ✅ New optional field
    default: "No",
    maxlength: 200,
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
