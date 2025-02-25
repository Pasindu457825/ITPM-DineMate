// frontend/src/components/AddOrderForm.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const AddOrderForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();  // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure the request data is properly structured
    const orderData = {
      name,
      description,
      price,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/orders/add-order",
        orderData
      );
      console.log("Order added:", response.data);

      // Navigate to the orders list page after the order is added
      navigate("/display-order");  // Redirect to /orders route
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  // Add a function to navigate to the orders List page
  const handleNavigateToOrdersList = () => {
    navigate("/display-order");  // Navigate to the order page
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Order Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Order Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Order Price"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value, 10))}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Order
        </button>
      </form>

      {/* Add a button to navigate to the Display Orders page */}
      <button
        onClick={handleNavigateToOrdersList}
        className="mt-4 bg-green-500 text-white p-2 rounded"
      >
        View Orders List
      </button>
    </div>
  );
};

export default AddOrderForm;
