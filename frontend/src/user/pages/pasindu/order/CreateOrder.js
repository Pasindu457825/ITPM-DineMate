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
      restaurantName: "",
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
        portionSize: item.portionSize || "Medium", // ✅ Ensure portion size is included
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
    <div className="bg-gray-200 pt-6 px-20 h-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section - Reservation & Order Info (1/3) */}
        <div className="md:w-2/3 ">
          <div className="py-3 px-8 bg-white shadow-2xl rounded-2xl">
            <h2 className="text-3xl font-bold my-6 text-gray-800 text-center">
              Order Items
            </h2>
            <div className="space-y-4">
              {items.map((item, index) => {
                const foodItem = Array.isArray(foodItems)
                  ? foodItems.find(
                      (food) =>
                        food.name.trim().toLowerCase() ===
                        item.name.trim().toLowerCase()
                    )
                  : null;

                return (
                  <div key={index}>
                    {/* Item Container */}
                    <div className="flex items-center pb-4">
                      {/* Food Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        {foodItem?.image ? (
                          <img
                            src={foodItem.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="ml-4 flex-grow">
                        <h4 className="text-lg font-semibold">{item.name}</h4>
                        <p className="text-gray-500">
                          Portion: {item.portionSize}
                        </p>
                        <p className="text-gray-500">
                          Price: Rs.{item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity & Total */}
                      <div className="flex items-center space-x-2">
                        <button className="p-2 bg-gray-200 rounded-lg">
                          ➖
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button className="p-2 bg-gray-200 rounded-lg">
                          ➕
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <p className="text-lg font-bold text-green-600 ml-4">
                        Rs.{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Divider Line */}
                    {index !== items.length - 1 && (
                      <hr className="border-t border-gray-300 my-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="md:w-1/3">
          <div className="flex flex-col items-center space-y-6">
            {/* Reservation Details Card */}
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                Reservation Details
              </h2>

              <p className="text-gray-900 text-lg text-center">
                <strong>Reservation ID:</strong>{" "}
                <span className="text-lg font-semibold text-amber-700">
                  {reservationId || "No Reservations"}
                </span>
              </p>

              {reservationDetails ? (
                <div className="bg-gray-100 p-5 rounded-lg mt-4 shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Reservation Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong className="text-gray-700">
                        Reservation Date:
                      </strong>{" "}
                      <span className="text-gray-900">
                        {reservationDetails.date}
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-700">Time:</strong>{" "}
                      <span className="text-gray-900">
                        {reservationDetails.time}
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-700">
                        Number of Guests:
                      </strong>{" "}
                      <span className="text-gray-900">
                        {reservationDetails.NoofPerson}
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-700">
                        Special Requests:
                      </strong>{" "}
                      <span className="text-gray-900">
                        {reservationDetails.specialRequests || "None"}
                      </span>
                    </p>
                  </div>
                </div>
              ) : reservationId ? (
                <p className="text-red-500 mt-3 text-center">
                  Fetching reservation details...
                </p>
              ) : null}
            </div>

            {/* Order Summary Card */}
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6">
              {/* Order Summary Title */}
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                Order Summary
              </h2>

              {/* Restaurant Name */}
              <p className="text-gray-600 text-lg text-center mb-4">
                <strong className="text-gray-800">Restaurant:</strong>{" "}
                {restaurantName}
              </p>

              {/* Order Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={customerName}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Customer Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="text"
                    name="customerEmail"
                    value={customerEmail}
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Payment Method */}
                <div className="flex items-center justify-between px-1 py-2 rounded-lg shadow-sm">
                  <span className="font-semibold text-gray-800 text-lg">
                    Payment Method:
                  </span>

                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOnlinePayment}
                      onChange={() => setIsOnlinePayment(!isOnlinePayment)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 flex items-center bg-blue-gray-900 rounded-full p-1 peer-checked:bg-amber-700 transition-all duration-300">
                      <div
                        className={`h-5 w-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          isOnlinePayment ? "translate-x-7" : ""
                        }`}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {isOnlinePayment ? "Online Payment" : "Cash Payment"}
                    </span>
                  </label>
                </div>

                {/* Order Type */}
                <p className="text-gray-800 mt-4 px-1 text-lg flex justify-between items-center">
                  <strong>Order Type:</strong>{" "}
                  <span className="text-lg font-semibold text-amber-700">
                    {orderType || "Not Selected"}
                  </span>
                </p>

                {/* Total Amount */}
                <div className="mt-4 px-1 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Total Amount</h3>
                  <p className="text-xl font-bold text-green-600">
                    Rs.{Number(total || 0).toFixed(2)}
                  </p>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-gray-900 text-white p-3 rounded-lg font-semibold text-lg hover:bg-blue-gray-600 transition duration-200"
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Section - Food Items Display (2/3) */}
      </div>
    </div>
  );
};

export default AddOrderForm;
