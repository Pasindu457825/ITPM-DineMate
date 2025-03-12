import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

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

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Restaurants List
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center gap-2">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md w-full max-w-md text-gray-800 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Clear
          </button>
        )}
      </div>

      {filteredRestaurants.length === 0 ? (
        <p className="text-gray-500 text-center">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out overflow-hidden cursor-pointer"
              onClick={() => navigate(`/user/restaurent-details/${restaurant._id}`)}
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
