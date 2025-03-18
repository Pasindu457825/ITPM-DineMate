import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateFoodForm = () => {
  const { id } = useParams(); // Get food item ID from URL
  const navigate = useNavigate();

  // State variables for food item details
  const [food, setFood] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch food item details on component mount
  useEffect(() => {
    if (!id) {
      setError("Invalid food ID.");
      setLoading(false);
      return;
    }

    const fetchFood = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/foodItems/get-food-item/${id}`
        );
        setFood(response.data);
      } catch (err) {
        setError("Error fetching food details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood({ ...food, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(
        `http://localhost:5000/api/ITPM/foodItems/update-food-item/${id}`, // Fixed API URL
        food
      );
      console.log("Food item updated successfully");
      navigate(`/restaurant/foods/${food.restaurantId}`); // Redirect after updating
    } catch (err) {
      console.error("Error updating food item:", err);
      setError("Failed to update food item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center">Loading food details...</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Update Food Item
      </h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={food.name}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={food.description}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={food.price}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={food.category}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mt-4"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Food Item"}
        </button>
      </form>

      <button
        onClick={() => navigate(`/restaurant/foods/${food.restaurantId}`)}
        className="mt-4 bg-green-500 text-white p-2 rounded w-full"
      >
        View Food Items List
      </button>
    </div>
  );
};

export default UpdateFoodForm;
