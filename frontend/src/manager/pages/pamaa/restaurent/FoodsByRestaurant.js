import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FoodsByRestaurant = () => {
  const { restaurantId } = useParams(); // Get restaurantId from URL params
  const [foods, setFoods] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Validate restaurantId
    if (!restaurantId || restaurantId === ":restaurantId") {
      console.error("Error: Invalid restaurantId received!");
      setError("Invalid restaurant ID.");
      setLoading(false);
      return;
    }

    const fetchFoods = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/foodItems/restaurant/foods/${restaurantId}` // ✅ Fixed API URL
        );

        // ✅ Ensure the response contains expected data
        if (response.data && Array.isArray(response.data.foods)) {
          setRestaurantName(response.data.restaurantName || "Restaurant");
          setFoods(response.data.foods);
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

  if (loading) return <p className="text-center text-gray-600">Loading food items...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{restaurantName} - Food Menu</h2>
      {foods.length === 0 ? (
        <p className="text-center">No food items found for this restaurant.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {foods.map((food) => (
            <li
              key={food._id}
              className="border p-4 rounded shadow-lg flex flex-col items-center"
            >
              <h3 className="text-lg font-semibold">{food.name}</h3>
              <p className="text-gray-700">{food.description}</p>
              <p className="text-green-600 font-bold">Rs.{food.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Category: {food.category}</p>
              {food.image && (
                <img src={food.image} alt={food.name} className="w-40 h-40 object-cover rounded mt-2" />
              )}
              {food.available ? (
                <span className="text-green-500 font-semibold mt-2">Available</span>
              ) : (
                <span className="text-red-500 font-semibold mt-2">Not Available</span>
              )}
            </li>
          ))}
          
        </ul>
      )}
    </div>
  );
};

export default FoodsByRestaurant;
