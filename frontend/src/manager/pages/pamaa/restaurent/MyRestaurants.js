import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import deleteRestaurant from './DeleteRestaurant';

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");  // State to hold the search term
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ITPM/restaurants/my-restaurants/:email"
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

  // Function to filter restaurants based on the search term
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-amber-500 pb-3">Restaurants List</h1>
      <input
        type="text"
        placeholder="Search by restaurant name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 p-3 border border-gray-300 rounded bg-white text-gray-800 w-full focus:border-amber-500 focus:outline-none"
      />
      {filteredRestaurants.length === 0 ? (
        <p className="text-gray-600">No restaurants match your search criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div 
              key={restaurant._id} 
              className="bg-white rounded-lg shadow overflow-hidden border-l-4 border-amber-500"
            >
              <div className="relative">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h2>
                 {/* <p className="text-gray-700">{restaurant.description}</p> */}
                <p className="text-gray-600 mb-2">{restaurant.location}</p>
                <p className="text-gray-600 mb-3">{restaurant.phoneNumber}</p>
                {restaurant.tables && restaurant.tables.length > 0 && (
                  <div className="text-gray-700 bg-gray-300 p-3 rounded-lg">
                    <p className="text-gray-900 font-medium mb-2">Table Configurations:</p>
                    {restaurant.tables.map((table, index) => (
                      <p key={index} className="text-gray-700">
                        Table {index + 1}: <span className="text-amber-600">{table.quantity}</span> tables with <span className="text-amber-600">{table.seats}</span> seats each
                      </p>
                    ))}
                  </div>
                )}
                <div className="bg-gray-100 p-4 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => navigate(`/restaurant/foods/${restaurant._id}`)}
                    className="flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white rounded py-2 transition-colors text-sm"
                  >
                    <span>Food Menu</span>
                  </button>
                  <button 
                    onClick={() => navigate(`/add-food/${restaurant._id}`)}
                    className="flex justify-center items-center bg-amber-600 hover:bg-amber-700 text-white rounded py-2 transition-colors text-sm"
                  >
                    <span>Add Food</span>
                  </button>
                  <button 
                    onClick={() => handleUpdate(restaurant._id)}
                    className="flex justify-center items-center bg-gray-500 hover:bg-gray-600 text-white rounded py-2 transition-colors text-sm"
                  >
                    <span>Update</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(restaurant._id)}
                    className="flex justify-center items-center bg-red-600 hover:bg-red-700 text-white rounded py-2 transition-colors text-sm"
                  >
                    <span>Delete</span>
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
