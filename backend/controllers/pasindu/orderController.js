const Order = require("../../models/pasindu/orderModel");
const FoodItem = require("../../models/pamaa/foodItemModel");
const User = require("../../models/tharusha/userModel");
const Restaurant = require("../../models/pamaa/restaurantModel");
const Reservation = require("../../models/pasindu/reservationModel"); // ✅ Update with the correct path

// Add new order
const createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      customerName,
      customerEmail,
      orderType,
      paymentType,
      orderStatus,
      total,
      items,
      reservationStatus,
    } = req.body;

    // ✅ Validate required fields
    if (
      !restaurantId ||
      !customerName ||
      !customerEmail ||
      !orderType ||
      !paymentType ||
      !orderStatus ||
      !items ||
      items.length === 0
    ) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // ✅ Generate Unique Order ID
    const orderId = `ORD-${Date.now()}`;

    // ✅ Process Items and Fetch Additional Info
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const foodItem = await FoodItem.findOne({
          name: item.name,
          restaurantId: restaurantId,
        });

        // ✅ Adjust price based on portion size if necessary
        let finalPrice = item.price;
        if (item.portionSize === "Large") {
          finalPrice = item.price; // Large costs 1.5x of base price
        } else {
          finalPrice = item.price; // Medium or any default size uses base price
        }

        return {
          name: item.name,
          quantity: item.quantity,
          price: finalPrice,
          portionSize: item.portionSize || "Medium", // ✅ Ensure portion size is saved
          image: foodItem?.image || "", // ✅ Store image URL if available, otherwise empty string
        };
      })
    );

    // ✅ Create New Order Document
    const newOrder = new Order({
      restaurantId,
      orderId,
      customerName,
      customerEmail,
      orderType,
      paymentType,
      orderStatus,
      total,
      items: enrichedItems,
      reservationStatus,
    });

    // ✅ Save Order in Database
    await newOrder.save();

    // ✅ Send Response
    res.status(201).json({
      message: "✅ Order added successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({
      message: "Error adding order",
      error: error.message,
    });
  }
};

// Get one order by ID
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id); // Using Mongoose's findById method
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order); // Return the order data as JSON
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all orders of the logged-in user
const getOrdersByCustomerEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // ✅ Fetch orders from the database
    const orders = await Order.find({
      customerEmail: new RegExp(`^${email}$`, "i"),
    });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    // ✅ Fetch restaurant names
    const restaurantIds = orders.map((order) => order.restaurantId);
    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } });

    // ✅ Fetch reservation details if `reservationId` exists
    const reservationIds = orders
      .map((order) => order.reservationStatus?.reservationId)
      .filter((id) => id && id !== "No");

    const reservations = await Reservation.find({
      reservationId: { $in: reservationIds },
    });

    // ✅ Attach restaurant names and reservation details to orders
    const ordersWithDetails = orders.map((order) => {
      const restaurant = restaurants.find(
        (r) => r._id.toString() === order.restaurantId.toString()
      );
      const reservation = reservations.find(
        (res) => res.reservationId === order.reservationStatus?.reservationId
      );

      return {
        ...order._doc,
        restaurantName: restaurant ? restaurant.name : "Unknown Restaurant",
        reservationDetails: reservation || null, // Attach full reservation details
      };
    });

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error("❌ Server Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    orderId,
    customerName,
    customerEmail,
    orderType,
    paymentType,
    orderStatus,
    total,
    items,
    reservationStatus,
  } = req.body;

  try {
    // Find the order by its ID and update it
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderId,
        customerName,
        customerEmail,
        orderType,
        paymentType,
        orderStatus,
        total,
        items,
        reservationStatus,
      }, // Fields to update
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder); // Return the updated order
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the order by its ID
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrdersByCustomerEmail,
  updateOrder,
  deleteOrder,
};
