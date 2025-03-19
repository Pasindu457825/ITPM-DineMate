import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import deleteFood from "../foodmenu/DeleteFood"; // Ensure this is the correct import path

const FoodsByRestaurant = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]); // State to hold filtered foods
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(""); // State for search text
  const [filter, setFilter] = useState(""); // State for category filter

  useEffect(() => {
    // Fetching and setting food data
    if (!restaurantId || restaurantId === ":restaurantId") {
      console.error("Error: Invalid restaurantId received!");
      setError("Invalid restaurant ID.");
      setLoading(false);
      return;
    }
    const fetchFoods = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/foodItems/restaurant/foods/${restaurantId}`
        );
        if (response.data && Array.isArray(response.data.foods)) {
          setRestaurantName(response.data.restaurantName || "Restaurant");
          setFoods(response.data.foods);
          setFilteredFoods(response.data.foods); // Initialize filtered foods
        } else {
          throw new Error("Invalid API response structure.");
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
        setError("Failed to fetch food items.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [restaurantId]);

  useEffect(() => {
    // Filtering logic
    let result = foods.filter(food =>
      food.name.toLowerCase().includes(search.toLowerCase()) && (filter ? food.category === filter : true)
    );
    setFilteredFoods(result);
  }, [search, filter, foods]);

  const handleDelete = (foodId) => {
    deleteFood(foodId, setFoods, foods);
  };

  const handleUpdate = (foodId) => {
    navigate(`/update-food/${foodId}`);
  };

  const toggleAvailability = async (foodId, currentAvailability) => {
    try {
      console.log(
        `Toggling availability for foodId: ${foodId}, Current: ${currentAvailability}` // Debugging
      ); 

      const response = await axios.patch(
        `http://localhost:5000/api/ITPM/foodItems/toggle-availability/${foodId}`
      );

      if (response.status === 200) {
        setFoods((prevFoods) =>
          prevFoods.map((food) =>
            food._id === foodId
              ? { ...food, availability: response.data.foodItem.availability } // Ensure correct state update
              : food
          )
        );
      } else {
        throw new Error("Failed to update availability.");
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      setError("Failed to toggle availability.");
    }
  };

  if (loading)
    return <p className="text-center text-black-600">Loading food items...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-black-900 border-b border-amber-500 pb-3">{restaurantName} - Food Menu</h2>

      {/* Search and filter inputs */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by food name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-3 rounded bg-white text-gray-800 focus:border-amber-500 focus:outline-none"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 p-3 rounded bg-white text-gray-800 focus:border-amber-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="salad">Salad</option>
          <option value="rolls">Rolls</option>
          <option value="desserts">Desserts</option>
          <option value="sandwich">Sandwich</option>
          <option value="cake">Cake</option>
          <option value="pure veg">Pure Veg</option>
          <option value="pasta">Pasta</option>
          <option value="noodles">Noodles</option>
          <option value="noodles">Beverages</option>
        </select>
      </div>

      {filteredFoods.length === 0 ? (
        <p className="text-center text-black-600">No matching food items found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {filteredFoods.map((food) => (
            <li
              key={food._id}
              className="border border-black-800 p-4 rounded-lg bg-blue-gray-900 shadow-xl flex flex-col items-center transform transition-transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-amber-500 mb-2">{food.name}</h3>
              {food.image && (
                <div className="w-full h-40 overflow-hidden rounded-lg mb-3 border border-black-700">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  />
                </div>
              )}
              <p className="text-gray-300 text-center mb-3 text-sm">{food.description}</p>
              <p className="text-amber-400 font-bold text-lg mb-2">
                Rs.{food.price.toFixed(2)}
              </p>
              <p className="text-xs text-blue-300 mb-1">Category: <span className="text-white">{food.category}</span></p>
              <p className="text-xs text-blue-300 mb-3">
                Status:{" "}
                {food.availability === "Available" ? (
                  <span className="text-green-400 font-semibold">
                    Available
                  </span>
                ) : (
                  <span className="text-red-400 font-semibold">
                    Unavailable
                  </span>
                )}
              </p>

              <div className="flex gap-2 mt-1 w-full justify-center">
                <button
                  onClick={() => handleUpdate(food._id)}
                  className="bg-black-700 text-white py-1 px-3 rounded text-sm hover:bg-black-600 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(food._id)}
                  className="bg-red-700 text-white py-1 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>

              <button
                onClick={() => toggleAvailability(food._id, food.availability)}
                className={`mt-2 w-full ${
                  food.availability === "Available"
                    ? "bg-amber-700 hover:bg-amber-600"
                    : "bg-amber-600 hover:bg-amber-500"
                } text-white py-1 px-3 rounded text-sm transition-colors`}
              >
                {food.availability === "Available"
                  ? "Make Unavailable"
                  : "Make Available"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FoodsByRestaurant;