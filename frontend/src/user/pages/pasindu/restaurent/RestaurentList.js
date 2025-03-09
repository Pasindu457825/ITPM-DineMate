import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ITPM/restaurants/get-all-restaurants"
        );
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Restaurants List
      </h1>

      {restaurants.length === 0 ? (
        <p className="text-gray-500 text-center">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out overflow-hidden cursor-pointer"
              onClick={() => navigate(`/user/restaurent-details/${restaurant._id}`)} // Navigate on click
            >
              {/* Restaurant Image */}
              <img
                src={restaurant.image || "https://via.placeholder.com/300"}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />

              {/* Restaurant Details */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {restaurant.name}
                </h2>
                <p className="text-gray-600 truncate">{restaurant.description}</p>
                <p className="text-gray-700">
                  <strong>Location:</strong> {restaurant.location}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {restaurant.phoneNumber}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
