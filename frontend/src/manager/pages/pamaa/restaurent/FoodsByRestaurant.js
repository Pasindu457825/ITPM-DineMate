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
    return <p className="text-center text-gray-600">Loading food items...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{restaurantName} - Food Menu</h2>

      {/* Search and filter inputs */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by food name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded"
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
        </select>
      </div>

      {filteredFoods.length === 0 ? (
        <p className="text-center">No matching food items found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredFoods.map((food) => (
            <li
              key={food._id}
              className="border p-4 rounded shadow-lg flex flex-col items-center"
            >
              <h3 className="text-lg font-semibold">{food.name}</h3>
              {food.image && (
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-40 h-40 object-cover rounded mt-2"
                />
              )}
              <p className="text-gray-700">{food.description}</p>
              <p className="text-green-600 font-bold">
                Rs.{food.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Category: {food.category}</p>
              <p className="text-sm text-gray-500">
                Availability:{" "}
                {food.availability === "Available" ? (
                  <span className="text-green-500 font-semibold mt-2">
                    Available
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold mt-2">
                    Unavailable
                  </span>
                )}
              </p>

              <button
                onClick={() => handleUpdate(food._id)}
                className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(food._id)}
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => toggleAvailability(food._id, food.availability)}
                className="mt-2 bg-yellow-500 text-black py-1 px-3 rounded"
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
