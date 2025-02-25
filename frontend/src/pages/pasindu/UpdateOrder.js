import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateOrder = () => {
  const { id } = useParams(); // Get order ID from URL params
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true); // For loading state
  const navigate = useNavigate();

  // Fetch the current orders data before updating
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Fetch order by ID
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/orders/display-orders/${id}`
        );
        const order = response.data;

        // Populate the form fields with the current order data
        if (order) {
          setName(order.name);
          setDescription(order.description);
          setPrice(order.price);
        }
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching order:", error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchOrder();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedOrder = { name, description, price };

    try {
      // Send the updated data to the backend
      const response = await axios.put(
        `http://localhost:5000/api/ITPM/orders/update-order/${id}`,
        updatedOrder
      );
      console.log("Order updated:", response.data);
      navigate("/display-order"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Show a loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Order Name"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Order Description"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        placeholder="Order Price"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Update Order
      </button>
    </form>
  );
};

export default UpdateOrder;
