import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AddOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { restaurantId, restaurantName, cart, orderType, reservationId } =
    location.state || {
      restaurantId: "",
      restaurantName: "Unknown Restaurant",
      cart: [],
      orderType: "",
      reservationId: "",
    };

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderStatus, setOrderStatus] = useState("Processing");
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [isOnlinePayment, setIsOnlinePayment] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);

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

  // Fetch reservation details if reservationId is provided
  useEffect(() => {
    if (!reservationId) {
      console.warn("⚠️ No reservation ID provided. Skipping API call.");
      return;
    }

    const fetchReservationDetails = async () => {
      try {
        // console.log("🔍 Fetching reservation details for ID:", reservationId);

        const response = await axios.get(
          `http://localhost:5000/api/ITPM/reservations/get-reservation/${reservationId}`
        );

        // console.log("✅ Reservation Details Fetched:", response.data);
        setReservationDetails(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch reservation details:", error);
        alert(
          `Error fetching reservation: ${
            error.response?.data?.message || "Unknown error"
          }`
        );
      }
    };

    fetchReservationDetails();
  }, [reservationId]); // Ensure it runs when reservationId changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      restaurantId,
      customerName,
      customerEmail,
      orderType,
      paymentType: isOnlinePayment 
        ? {paymentMethod: "Online Payment", paymentStatus: "Pending"} // Online payments have "Pending" status
        : {paymentMethod: "Cash Payment", paymentStatus: "No"}, // Cash payments are directly marked
      orderStatus,
      total: parseFloat(total),
      items,
      reservationStatus:
        reservationId && reservationId.trim() !== ""
          ? { reservationId: reservationId, status: "Available" }
          : { reservationId: "No", status: "Unavailable" }, // Store as an array
    };

    console.log("🚀 Sending Order Data:", orderData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/orders/add-order",
        orderData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ Order Created:", response.data);

      if (isOnlinePayment) {
        navigate("/payment-page", {
          state: { orderId: response.data._id, total },
        });
      } else {
        navigate("/success-page");
      }
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

        <p className="text-gray-600">
          <strong>Order Type:</strong>{" "}
          <span className="text-lg font-semibold text-blue-500">
            {orderType || "Not Selected"}
          </span>
        </p>

        <p className="text-gray-600">
          <strong>Reservation ID:</strong>{" "}
          <span className="text-lg font-semibold text-blue-500">
            {reservationId || "Not Selected"}
          </span>
        </p>

        {reservationDetails ? (
          <div className="border p-4 rounded bg-gray-100">
            <h3 className="text-lg font-semibold">Reservation Details</h3>
            <p>
              <strong>Customer Name:</strong> {reservationDetails.customerName}
            </p>
            <p>
              <strong>Reservation Date:</strong> {reservationDetails.date}
            </p>
            <p>
              <strong>Time:</strong> {reservationDetails.time}
            </p>
            <p>
              <strong>Number of Guests:</strong> {reservationDetails.NoofPerson}
            </p>
            <p>
              <strong>Special Requests:</strong>{" "}
              {reservationDetails.specialRequests || "None"}
            </p>
          </div>
        ) : reservationId ? (
          <p className="text-red-500">Fetching reservation details...</p>
        ) : null}

        <h3 className="text-lg font-semibold mt-4">Order Items</h3>
        {items.map((item, index) => (
          <p key={index}>
            {item.name} - {item.quantity} x ${item.price.toFixed(2)}
          </p>
        ))}

        <div className="flex items-center justify-between">
          <span className="font-semibold">Payment Method:</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isOnlinePayment}
              onChange={() => setIsOnlinePayment(!isOnlinePayment)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium">
              {isOnlinePayment ? "Online Payment" : "Cash Payment"}
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default AddOrderForm;
