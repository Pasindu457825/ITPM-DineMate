import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // ✅ for grabbing restaurantId
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagerHeader from "../../components/ManagerHeader";
import ManagerFooter from "../../components/ManagerFooter";

const MyRestaurantOrders = () => {
  const { restaurantId } = useParams(); // ✅ Get restaurantId from URL
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ManagerHeader />
      <ToastContainer />
      <main className="flex-grow py-8 px-6">
        <h2 className="text-3xl font-bold mb-6 text-[#262B3E]">
          Orders for Restaurant: {restaurantId}
        </h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found for this restaurant.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow rounded-lg p-6 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#262B3E]">
                    Order ID: {order.orderId}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {order.orderStatus}
                  </span>
                </div>

                <p>
                  <strong>Customer:</strong> {order.customerName}
                </p>
                <p>
                  <strong>Email:</strong> {order.customerEmail}
                </p>
                <p>
                  <strong>Order Type:</strong> {order.orderType}
                </p>
                <p>
                  <strong>Total:</strong> Rs. {order.total}
                </p>

                {/* Payment Info */}
                <div className="mt-2">
                  <h4 className="font-semibold text-[#262B3E]">Payment</h4>
                  <p className="text-sm text-gray-700">
                    Method: {order.paymentType?.paymentMethod || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    Status: {order.paymentType?.paymentStatus || "N/A"}
                  </p>
                </div>

                {/* Items */}
                <div className="mt-2">
                  <h4 className="font-semibold text-[#262B3E]">Items</h4>
                  <ul className="list-disc ml-5 space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {item.name} - {item.quantity} × Rs. {item.price} (
                        {item.portionSize})
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reservation Info */}
                <div className="mt-2">
                  <h4 className="font-semibold text-[#262B3E]">Reservation</h4>
                  <p className="text-sm text-gray-700">
                    ID:{" "}
                    {order.reservationDetails && (
                      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                        <h4 className="font-semibold text-[#262B3E] mb-2">
                          Reservation Info
                        </h4>

                        <p className="text-sm text-gray-700">
                          <strong>Table Number:</strong>{" "}
                          {order.reservationDetails.tableNumber}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>No. of Persons:</strong>{" "}
                          {order.reservationDetails.NoofPerson}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Date:</strong> {order.reservationDetails.date}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Time:</strong> {order.reservationDetails.time}
                        </p>
                      </div>
                    )}
                  </p>
                  <p className="text-sm text-gray-700">
                    Status: {order.reservationStatus?.status || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <ManagerFooter />
    </div>
  );
};

export default MyRestaurantOrders;
