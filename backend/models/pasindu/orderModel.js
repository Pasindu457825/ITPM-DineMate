const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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
    paymentType: {
      type: {
        paymentMethod: { type: String, default: "No" },
        paymentStatus: { type: String, required: true },
      },
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
      type: {
        reservationId: { type: String, default: "No" },
        status: { type: String, required: true },
      },
      required: true,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model("Order", orderSchema);
