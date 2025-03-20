import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setError("You must be logged in to view your restaurants");
        setLoading(false);
        toast.error("Please login to view your restaurants");
        return;
      }
      
      const response = await axios.get(`http://localhost:5000/api/ITPM/restaurants/get-all-restaurants?userId=${userId}`);
      setRestaurants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError(error.response?.data?.message || "Failed to load restaurants");
      setLoading(false);
      toast.error("Failed to load restaurants");
    }
  };

  const toggleRestaurantStatus = async (id, isEnabled) => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.patch(`http://localhost:5000/api/ITPM/restaurants/toggle-status/${id}?userId=${userId}`, { isEnabled: !isEnabled });
      toast.success("Restaurant status updated successfully");
      fetchRestaurants();
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      toast.error(error.response?.data?.message || "Failed to update restaurant status");
    }
  };

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-amber-500 pb-3">Restaurants List</h1>
      {restaurants.length === 0 ? (
        <p className="text-gray-600">No restaurants available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-white rounded-lg shadow overflow-hidden border-l-4 border-amber-500">
              <div className="relative">
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 mb-2">{restaurant.location}</p>
                <p className="text-gray-600 mb-3">{restaurant.phoneNumber}</p>
                {restaurant.tables && restaurant.tables.length > 0 && (
                  <div className="text-gray-700 bg-gray-300 p-3 rounded-lg">
                    {restaurant.tables.map((table, index) => (
                      <p key={index} className="text-gray-700">
                        Table {index + 1}: <span className="text-amber-600">{table.quantity}</span> tables with <span className="text-amber-600">{table.seats}</span> seats each
                      </p>
                    ))}
                  </div>
                )}
                <div className="bg-gray-100 p-4 grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => navigate(`/restaurant/foods/${restaurant._id}`)}
                    className="flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white rounded py-2 transition-colors text-sm"
                  >
                    <span>Food Menu</span>
                  </button>
                  <button 
                    onClick={() => toggleRestaurantStatus(restaurant._id, restaurant.isEnabled)}
                    className={`flex justify-center items-center ${restaurant.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded py-2 transition-colors text-sm`}
                  >
                    <span>{restaurant.isEnabled ? 'Disable' : 'Enable'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
