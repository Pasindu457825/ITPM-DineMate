import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AddOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract restaurant details and cart items from navigation state
  const { restaurantId, restaurantName, cart, orderType } = location.state || {
    restaurantId: "",
    restaurantName: "Unknown Restaurant",
    cart: [],
    orderType: "",
  };

  // State variables for order details
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedOrderType, setSelectedOrderType] = useState(orderType);
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [orderStatus, setOrderStatus] = useState("Processing");
  const [reservationStatus, setReservationStatus] = useState("None");
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);

  // Automatically populate items from cart and calculate total price
  useEffect(() => {
    setItems(
      cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))
    );

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount.toFixed(2));
  }, [cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderTotal = parseFloat(total) || 0;

    const orderData = {
      restaurantId,
      customerName,
      customerEmail,
      orderType: selectedOrderType,
      paymentStatus,
      orderStatus,
      total: orderTotal,
      items,
      reservationStatus,
    };

    console.log("🚀 Sending Order Data:", orderData); // Debug Log

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/orders/create-order",
        orderData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Order Created:", response.data);
      navigate("/display-orders");
    } catch (error) {
      console.error(
        "❌ Order Submission Error:",
        error.response?.data || error
      );
      alert(
        `Order submission failed: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <p className="text-gray-600">
        <strong>Restaurant:</strong> {restaurantName}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="p-2 border rounded w-full"
        />
        <input
          type="email"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
          className="p-2 border rounded w-full"
        />

        {/* ✅ Display Selected Order Type */}
        <p className="text-gray-600">
          <strong>Order Type:</strong>{" "}
          <span className="text-lg font-semibold text-blue-500">
            {selectedOrderType || "Not Selected"}
          </span>
        </p>

        <h3 className="text-lg font-semibold mt-4">Order Items</h3>
        {items.map((item, index) => (
          <p key={index}>
            {item.name} - {item.quantity} x ${item.price.toFixed(2)}
          </p>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mt-4"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default AddOrderForm;
