import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import deleteFood from "./DeleteFood"; // Assuming you have a delete function for food items

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ITPM/food-items/get-all-food-items"
        );
        setFoods(response.data);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoods();
  }, []);

  // Handle delete food item
  const handleDelete = async (id) => {
    await deleteFood(id, setFoods, foods);
  };

  // Navigate to update food item page
  const handleUpdate = (id) => {
    navigate(`/update-food/${id}`);
  };

  // Toggle food availability
  const handleToggleAvailability = async (id, available) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/ITPM/food-items/toggle-availability/${id}`,
        {
          available: !available,
        }
      );
      setFoods(
        foods.map((food) =>
          food._id === id ? { ...food, available: !available } : food
        )
      );
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Food Items List</h1>
      {foods.length === 0 ? (
        <p className="text-gray-500">No food items found.</p>
      ) : (
        <ul className="space-y-4">
          {foods.map((food) => (
            <li
              key={food._id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
              <div className="flex flex-col space-y-2">
                {/* Food Details */}
                <h2 className="text-2xl font-semibold text-gray-800">
                  {food.name}
                </h2>
                <p className="text-gray-600">{food.description}</p>
                <p className="text-lg font-medium text-green-600">
                  <strong>Price:</strong> ${food.price}
                </p>
                <p className="text-gray-700">
                  <strong>Category:</strong> {food.category}
                </p>
                <p className="text-gray-700">
                  <strong>Availability:</strong>{" "}
                  {food.available ? "Available" : "Not Available"}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleUpdate(food._id)}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(food._id)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      handleToggleAvailability(food._id, food.available)
                    }
                    className={`px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 ${
                      food.available
                        ? "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                        : "bg-gray-500 hover:bg-gray-600 focus:ring-gray-500"
                    } text-white`}
                  >
                    {food.available ? "Make Unavailable" : "Make Available"}
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

export default FoodList;
