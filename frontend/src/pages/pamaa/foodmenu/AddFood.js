import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddFoodForm = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // State variables for food item details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true); // Default to true

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure price is a number
    const itemPrice = parseFloat(price) || 0;

    // Food item object matching backend structure
    const foodData = {
      name,
      description,
      price: itemPrice,
      category,
      available, // Include availability in the payload
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/foodItems/create-food-item",
        foodData
      );
      console.log("Food item added:", response.data);

      // Redirect to food items list after adding
      navigate("/display-food-items");
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Food Item Details */}
        <input
          type="text"
          placeholder="Food Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        {/* Availability Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="mt-2"
          />
          <label className="ml-2 text-gray-700">Available</label>
        </div>

        {/* Submit Food Item */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mt-4"
        >
          Add Food Item
        </button>
      </form>

      {/* Button to View Food Items List */}
      <button
        onClick={() => navigate("/display-food-items")}
        className="mt-4 bg-red-500 text-white p-2 rounded w-full"
      >
        View Food Items List
      </button>
    </div>
  );
};

export default AddFoodForm;
