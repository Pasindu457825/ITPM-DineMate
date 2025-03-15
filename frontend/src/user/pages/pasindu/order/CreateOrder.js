import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AddOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null); // ✅ Define user state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderStatus, setOrderStatus] = useState("Processing");
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [isOnlinePayment, setIsOnlinePayment] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [foodItems, setFoodItems] = useState([]);

  const { restaurantId, restaurantName, cart, orderType, reservationId } =
    location.state || {
      restaurantId: "",
      restaurantName: "Unknown Restaurant",
      cart: [],
      orderType: "",
      reservationId: "",
    };

  // ✅ Fetch profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found. User might not be logged in.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/ITPM/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error.response?.data || error.message
        );
      }
    };

    fetchProfile();
  }, []);

  // ✅ Update customer details after user data is fetched
  useEffect(() => {
    if (user) {
      setCustomerName(`${user.fname} ${user.lname}`.trim());
      setCustomerEmail(user.email);
    }
  }, [user]);

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

  // Update formData when user is fetched

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

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        if (!restaurantId) {
          console.warn("⚠️ No restaurantId provided. Skipping API call.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/ITPM/foodItems/restaurant/foods/${restaurantId}`
        );

        console.log("✅ API Response:", response.data); // Debugging log

        // ✅ Extract the "foods" array from the response
        if (response.data?.foods && Array.isArray(response.data.foods)) {
          setFoodItems(response.data.foods);
        } else {
          console.error("❌ API returned an invalid format:", response.data);
          setFoodItems([]); // Ensure it's always an array
        }
      } catch (error) {
        console.error(
          "❌ Error fetching food items:",
          error.response?.data || error.message
        );
        setFoodItems([]); // Handle errors by setting an empty array
      }
    };

    fetchFoodItems();
  }, [restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      restaurantId,
      customerName,
      customerEmail,
      orderType,
      paymentType: isOnlinePayment
        ? { paymentMethod: "Online Payment", paymentStatus: "Pending" } // Online payments have "Pending" status
        : { paymentMethod: "Cash Payment", paymentStatus: "No" }, // Cash payments are directly marked
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
        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={customerName}
            readOnly // 🔒 Prevents user from editing
            className="p-2 border border-gray-300 rounded w-full bg-gray-100 cursor-not-allowed pointer-events-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={customerEmail}
            readOnly // 🔒 Prevents user from editing
            className="p-2 border border-gray-300 rounded w-full bg-gray-100 cursor-not-allowed pointer-events-none"
          />
        </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {items.map((item, index) => {
            // ✅ Ensure foodItems is an array before using .find()
            const foodItem = Array.isArray(foodItems)
              ? foodItems.find(
                  (food) =>
                    food.name.trim().toLowerCase() ===
                    item.name.trim().toLowerCase()
                )
              : null;

            return (
              <div
                key={index}
                className="bg-white p-4 border border-gray-300 rounded-lg shadow-md"
              >
                {/* ✅ Display Food Image if Available */}
                {foodItem?.image ? (
                  <img
                    src={foodItem.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}

                <h4 className="text-lg font-semibold">{item.name}</h4>
                <p className="text-gray-700">Quantity: {item.quantity}</p>
                <p className="text-gray-700">Price: ${item.price.toFixed(2)}</p>
                <p className="text-green-600 font-bold">
                  Total: ${(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {/* ✅ Display Total Amount */}
        <h3 className="text-lg font-semibold mt-4">Total Amount</h3>
        <p className="text-xl font-bold text-green-600">${total}</p>

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
