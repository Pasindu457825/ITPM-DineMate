import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import deleteRestaurant from "../../../../manager/pages/pamaa/restaurent/DeleteRestaurant";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      await deleteRestaurant(id, setRestaurants, restaurants);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-restaurant/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Restaurants List</h1>
      {restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants found.</p>
      ) : (
        <ul className="space-y-4">
          {restaurants.map((restaurant) => (
            <li key={restaurant._id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              <div className="flex flex-col space-y-2">
                <img src={restaurant.image} alt="Restaurant" className="w-full h-64 object-cover rounded-lg"/>
                <h2 className="text-2xl font-semibold text-gray-800">{restaurant.name}</h2>
                <p className="text-gray-600">{restaurant.description}</p>
                <p className="text-gray-700"><strong>Location:</strong> {restaurant.location}</p>
                <p className="text-gray-700"><strong>Phone Number:</strong> {restaurant.phoneNumber}</p>
                {restaurant.tables && restaurant.tables.length > 0 && (
                  <div className="text-gray-700">
                    <strong>Table Configurations:</strong>
                    {restaurant.tables.map((table, index) => (
                      <p key={index}>Table {index + 1}: {table.quantity} tables with {table.seats} seats each</p>
                    ))}
                  </div>
                )}
               <div className="flex space-x-4 mt-4">
               <button onClick={() => navigate(`/restaurant/foods/${restaurant._id}`)} 
          className="px-6 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-blue-500 hover:bg-blue-700">
    View Food Items List
  </button>
  <button onClick={() => navigate(`/add-food/${restaurant._id}`)} 
          className="px-6 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 text-white bg-green-500 hover:bg-green-700">
    Add Food Item
  </button>
  <button onClick={() => handleUpdate(restaurant._id)} 
          className="px-6 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white bg-yellow-600 hover:bg-yellow-700">
    Update
  </button>
  <button onClick={() => handleDelete(restaurant._id)} 
          className="px-6 py-4 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 text-white bg-red-600 hover:bg-red-700">
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
