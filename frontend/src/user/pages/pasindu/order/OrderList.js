import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found. Redirecting to login.");
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/ITPM/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (error) {
        console.error(
          "❌ Error fetching profile:",
          error.response?.data || error.message
        );
        setError("Failed to fetch user data");
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (user && user.email) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/ITPM/orders/my-orders/${user.email}`
          );

          if (Array.isArray(response.data)) {
            setOrders(response.data);
          } else {
            console.error("❌ Invalid data format received:", response.data);
            setOrders([]);
          }
        } catch (error) {
          console.error(
            "❌ Error fetching orders:",
            error.response?.data || error.message
          );
          setError("Failed to fetch order details");
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user]);

  if (loading) return <p className="text-gray-600">Loading order details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded bg-white shadow-md"
            >
              <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
              <p>
                <strong>Restaurant:</strong> {order.restaurantName || "N/A"}{" "}
                {/* ✅ Use restaurantName */}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-bold ${
                    order.orderStatus === "Completed"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {order.paymentType?.paymentMethod || "N/A"}
              </p>
              <p>
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </p>

              <button
                onClick={() =>
                  navigate(`/order/${order._id}`, { state: { order } })
                }
                className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
