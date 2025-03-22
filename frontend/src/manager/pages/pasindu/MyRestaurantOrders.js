import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagerHeader from "../../components/ManagerHeader";
import ManagerFooter from "../../components/ManagerFooter";

const MyRestaurantOrders = () => {
  const { restaurantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [restaurantId]);

  const fetchOrders = async () => {
    try {
      if (!restaurantId) {
        toast.error("Restaurant ID is missing in URL.");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/ITPM/orders/restaurant-orders/${restaurantId}`
      );

      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <ManagerHeader />
      <ToastContainer />
      <main className="flex-grow py-12 px-6 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#262B3E] mb-10">
            Restaurant Orders
          </h2>

          {loading ? (
            <div className="text-center text-[#276265]">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-600">
              No orders found for this restaurant.
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-2 gap-6 space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 break-inside-avoid"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-[#262B3E]">
                      Order ID:{" "}
                      <span className="text-[#3D4359]">{order.orderId}</span>
                    </h3>
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-medium ${
                        order.orderStatus === "Processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>Customer:</strong> {order.customerName}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.customerEmail}
                    </p>
                    <p>
                      <strong>Order Type:</strong> {order.orderType}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="text-sm font-bold">Total:</span>{" "}
                      <span className="font-extrabold text-[#1e4a4c]">
                        Rs. {order.total?.toLocaleString("en-LK")}
                      </span>
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div className="mt-4 border-t pt-3">
                    <h4 className="text-[#262B3E] font-semibold mb-1">
                      Payment
                    </h4>
                    <p className="text-sm text-gray-700">
                      Method: {order.paymentType?.paymentMethod || "N/A"}
                    </p>
                  </div>

                  {/* Items */}
                  {/* Items - Two Column Layout */}
                  <div className="mt-4 border-t pt-4">
                    <h4 className="text-[#262B3E] font-semibold mb-3">
                      Items Ordered
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h5 className="font-semibold text-[#262B3E] text-sm">
                                {item.name}
                              </h5>
                              <p className="text-xs text-gray-600">
                                Portion:{" "}
                                <span className="font-medium">
                                  {item.portionSize}
                                </span>
                              </p>
                              <p className="text-xs text-gray-600">
                                Quantity:{" "}
                                <span className="font-medium">
                                  {item.quantity}
                                </span>
                              </p>
                              <p className="text-sm font-bold text-[#276265] mt-1">
                                Rs. {item.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reservation Info */}
                  {order.reservationDetails && (
                    <div className="mt-4 border-t pt-3 bg-gray-50 rounded-md p-3">
                      <h4 className="text-[#262B3E] font-semibold mb-2">
                        Reservation Details
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>Table Number:</strong>{" "}
                          {order.reservationDetails.tableNumber}
                        </p>
                        <p>
                          <strong>No. of Persons:</strong>{" "}
                          {order.reservationDetails.NoofPerson}
                        </p>
                        <p>
                          <strong>Date:</strong> {order.reservationDetails.date}
                        </p>
                        <p>
                          <strong>Time:</strong> {order.reservationDetails.time}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <ManagerFooter />
    </div>
  );
};

export default MyRestaurantOrders;
