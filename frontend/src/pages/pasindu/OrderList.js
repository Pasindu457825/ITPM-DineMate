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
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, []);

  // Function to handle order deletion
  const handleDelete = (id) => {
    deleteOrder(id, setOrders, orders); // Call the delete function from delete.js
  };

  // Function to navigate to the update page (passing order ID to pre-fill form)
  const handleUpdate = (id) => {
    navigate(`/update-order/${id}`); // Navigate to Update order page
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Orders List</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id} className="border-b p-4 mb-4 hover:shadow-lg transition duration-300 ease-in-out">
            <div className="flex justify-between orders-center mb-4">
              {/* Order Name, Price, and Description */}
              <div className="flex flex-row space-x-8">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-semibold text-gray-800">{order.name}</h2>
                </div>
                <div className="flex flex-col w-1/2">
                  <p className="text-gray-600">{order.description}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-medium text-green-600">${order.price}</p>
                </div>
                
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
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
    </div>
  );
};

export default OrdersList;
