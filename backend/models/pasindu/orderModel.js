const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
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
    type: mongoose.Schema.Types.ObjectId, // Stores reservationId reference
    ref: "Reservation", // Reference to the Reservation model
    default: null, // If no reservation, it is null
  },
});


module.exports = mongoose.model('Order', orderSchema);
