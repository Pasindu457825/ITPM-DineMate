// frontend/src/components/AddItemForm.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const AddItemForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();  // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure the request data is properly structured
    const itemData = {
      name,
      description,
      price,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/items/add-item",
        itemData
      );
      console.log("Item added:", response.data);

      // Navigate to the items list page after the item is added
      navigate("/display-item");  // Redirect to /items route
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Add a function to navigate to the Items List page
  const handleNavigateToItemsList = () => {
    navigate("/display-item");  // Navigate to the items page
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Item Price"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value, 10))}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Item
        </button>
      </form>

      {/* Add a button to navigate to the Display Items page */}
      <button
        onClick={handleNavigateToItemsList}
        className="mt-4 bg-green-500 text-white p-2 rounded"
      >
        View Items List
      </button>
    </div>
  );
};

export default AddItemForm;
