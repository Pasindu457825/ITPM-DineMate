import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import deleteRestaurant from "./DeleteRestaurant"; // Import the delete function for restaurants

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); // Use navigate function for redirection

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

  // Function to handle restaurant deletion
  const handleDelete = async (id) => {
    await deleteRestaurant(id, setRestaurants, restaurants); // Call delete function
  };

  // Function to navigate to the update page (passing restaurant ID to pre-fill form)
  const handleUpdate = (id) => {
    navigate(`/update-restaurant/${id}`); // Navigate to Update Restaurant page
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Restaurants List
      </h1>
      <button
        onClick={() => navigate("/add-food")} // Adjust the route as necessary
        className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
      >
        Add Food Item
      </button>
      {restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants found.</p>
      ) : (
        <ul className="space-y-4">
          {restaurants.map((restaurant) => (
            <li
              key={restaurant._id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
              <div className="flex flex-col space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {restaurant.name}
                </h2>
                <p className="text-gray-600">{restaurant.description}</p>
                <p className="text-gray-700">
                  <strong>Location:</strong> {restaurant.location}
                </p>
                <p className="text-gray-700">
                  <strong>Phone Number:</strong> {restaurant.phoneNumber}
                </p>
                <p className="text-gray-700">
                  <strong>Number of Tables:</strong> {restaurant.numberOfTables}
                </p>
                <p className="text-gray-700">
                  <strong>Seats Per Table:</strong> {restaurant.seatsPerTable}
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleUpdate(restaurant._id)}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant._id)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
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

export default RestaurantsList;
