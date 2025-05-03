import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  Calendar,
  Clock,
  CreditCard,
  HandCoins,
  CheckCircle,
} from "lucide-react";

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

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

  if (loading)
    return (
      <p className="text-gray-600 text-center">Loading order details...</p>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="bg-gray-200">
      <div className="p-6 max-w-7xl mx-auto">
        <h2
          className="text-5xl font-bold text-center mb-6"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Your Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-white text-center">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {orders.map((order) => (
              <Card
                key={order._id} // ✅ Set a default valid color
                variant="gradient"
                className="p-8 bg-blue-gray-900"
              >
                <CardHeader
                  floated={false}
                  shadow={false}
                  color="transparent"
                  className="m-0 mb-6 border-b border-white/20 pb-4 text-center"
                >
                  {/* <Typography
                    variant="small"
                    color="white"
                    className="font-normal uppercase"
                  >
                    Order ID: {order._id}
                  </Typography> */}

                  <Typography
                    variant="h3"
                    color="white"
                    className="mt-3 font-semibold"
                  >
                    {order.restaurantName || "Unknown Restaurant"}
                  </Typography>
                </CardHeader>
                <CardBody className="p-0 mt-6">
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-center gap-3">
                      <span className="p-1 bg-blue-gray-900 rounded-full border border-blue-gray-900">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </span>
                      <Typography className="font-normal text-white">
                        Date:{" "}
                        {new Date(order.updatedAt).toLocaleDateString("en-GB")}
                      </Typography>
                    </li>

                    <li className="flex items-center gap-3">
                      <span className="p-1 bg-blue-gray-900 rounded-full border border-blue-gray-900">
                        <Clock className="h-4 w-4 text-yellow-500" />
                      </span>
                      <Typography className="font-normal text-white">
                        Time:{" "}
                        {new Date(order.updatedAt).toLocaleTimeString("en-GB")}
                      </Typography>
                    </li>

                    <li className="flex items-center gap-3">
                      <span className="p-1 bg-blue-gray-900 rounded-full border border-blue-gray-900">
                        <CreditCard className="h-4 w-4 text-green-500" />
                      </span>
                      <Typography className="font-normal text-white">
                        Payment: {order.paymentType?.paymentMethod || "N/A"}
                      </Typography>
                    </li>

                    <li className="flex items-center gap-3">
                      <span className="p-1 bg-blue-gray-900 rounded-full border border-blue-gray-900">
                        <HandCoins className="h-4 w-4 text-orange-500" />
                      </span>
                      <Typography className="font-normal text-white">
                        Total: Rs. {order.total.toFixed(2)}
                      </Typography>
                    </li>

                    {/* <li className="flex items-center gap-3">
                      <span className="p-1 bg-blue-gray-900 rounded-full border border-blue-gray-900">
                        <CheckCircle
                          className={`h-4 w-4 ${
                            order.orderStatus === "Completed"
                              ? "text-green-500"
                              : order.orderStatus === "Pending"
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        />
                      </span>
                      <Typography className="font-normal text-white">
                        Status:{" "}
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-semibold ${
                            order.orderStatus === "Completed"
                              ? "bg-green-200 text-green-700"
                              : order.orderStatus === "Pending"
                              ? "bg-red-200 text-red-700"
                              : "bg-blue-200 text-blue-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </Typography>
                    </li> */}
                  </ul>
                </CardBody>
                <CardFooter className="mt-6 p-0">
                  <Button
                    size="lg"
                    color="white"
                    className="mt-8 hover:scale-[1.02] focus:scale-[1.02] active:scale-100"
                    ripple={false}
                    fullWidth={true}
                    onClick={() =>
                      navigate(`/order/${order._id}`, { state: { order } })
                    }
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
