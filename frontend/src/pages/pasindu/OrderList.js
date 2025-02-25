import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import deleteOrder from "./DeleteOrder"; // Import the delete function

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate(); // Use navigate function for redirection

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ITPM/orders/display-orders"
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle order deletion
  const handleDelete = async (id) => {
    await deleteOrder(id, setOrders, orders); // Call the delete function from delete.js
  };

  // Function to navigate to the update page (passing order ID to pre-fill form)
  const handleUpdate = (id) => {
    navigate(`/update-order/${id}`); // Navigate to Update order page
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders List</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              <div className="flex flex-col space-y-2">
                {/* Customer Details */}
                <h2 className="text-2xl font-semibold text-gray-800">{order.customerName}</h2>
                <p className="text-gray-600">Email: {order.customerEmail}</p>

                {/* Order Details */}
                <p className="text-gray-700">
                  <strong>Order Type:</strong> {order.orderType}
                </p>
                <p className="text-gray-700">
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </p>
                <p className="text-gray-700">
                  <strong>Order Status:</strong> {order.orderStatus}
                </p>
                <p className="text-lg font-medium text-green-600">
                  <strong>Total:</strong> ${order.total}
                </p>

                {/* Display Ordered Items */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-lg font-semibold text-gray-800">Items:</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} - {item.quantity} x ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleUpdate(order._id)}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersList;
