import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateOrder = () => {
  const { id } = useParams(); // Get item ID from URL params
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true); // For loading state
  const navigate = useNavigate();

  // Fetch the current item data before updating
  useEffect(() => {
    const fetchItem = async () => {
      try {
        // Fetch item by ID
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/items/display-items/${id}`
        );
        const item = response.data;

        // Populate the form fields with the current item data
        if (item) {
          setName(item.name);
          setDescription(item.description);
          setPrice(item.price);
        }
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching item:", error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchItem();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedItem = { name, description, price };

    try {
      // Send the updated data to the backend
      const response = await axios.put(
        `http://localhost:5000/api/ITPM/items/update-item/${id}`,
        updatedItem
      );
      console.log("Item updated:", response.data);
      navigate("/display-item"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating item:", error);
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
        placeholder="Item Name"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Item Description"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        placeholder="Item Price"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Update Item
      </button>
    </form>
  );
};

export default UpdateOrder;
