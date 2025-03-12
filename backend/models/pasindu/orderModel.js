const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
  },
  restaurantId: { 
    type: String,
    required: true, // Ensure that each order is linked to a restaurant
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  orderType: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: false,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
      },
    },
  ],
  reservationStatus: {
    type: mongoose.Schema.Types.ObjectId, // Stores reference to Reservation model
    ref: "Reservation",
    default: null, // If no reservation, it is null
  },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Order', orderSchema);
