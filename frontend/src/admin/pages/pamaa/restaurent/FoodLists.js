import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Filter, ArrowLeft, Tag, CheckCircle, XCircle } from 'lucide-react';

const FoodLists = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
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
          setFilteredFoods(response.data.foods);
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
    let result = foods.filter(food =>
      food.name.toLowerCase().includes(search.toLowerCase()) && 
      (filter ? food.category.toLowerCase() === filter.toLowerCase() : true)
    );
    setFilteredFoods(result);
  }, [search, filter, foods]);

  // Get unique categories from foods array
  const categories = [...new Set(foods.map(food => food.category))];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Restaurants
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4 md:mb-0">
            {restaurantName} - Food Menu
          </h2>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}
              title="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}
              title="List View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-indigo-400" />
            </div>
            <input
              type="text"
              placeholder="Search by food name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-colors"
            />
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-indigo-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 focus:outline-none appearance-none transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">
              {search || filter ? "No matching food items found." : "No food items available for this restaurant."}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <div 
                key={food._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {food.image && (
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image';
                      }}
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          food.availability === "Available" 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {food.availability}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{food.name}</h3>
                    <p className="font-bold text-indigo-600">Rs.{food.price.toFixed(2)}</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2 h-10">
                    {food.description || "No description available"}
                  </p>
                  
                  <div className="mt-3 flex items-center">
                    <Tag size={14} className="text-indigo-400 mr-1" />
                    <span className="text-xs text-gray-500 bg-indigo-50 px-2 py-1 rounded">
                      {food.category.charAt(0).toUpperCase() + food.category.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFoods.map((food) => (
              <div 
                key={food._id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex transition-all duration-300 hover:shadow-lg"
              >
                {food.image && (
                  <div className="relative w-24 h-24 sm:w-36 sm:h-36 flex-shrink-0 bg-gray-200">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Food';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-4 flex-grow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{food.name}</h3>
                    <div className="flex items-center mt-1 sm:mt-0">
                      <p className="font-bold text-indigo-600 mr-3">Rs.{food.price.toFixed(2)}</p>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          food.availability === "Available" 
                            ? 'bg-emerald-100 text-emerald-800 flex items-center' 
                            : 'bg-red-100 text-red-800 flex items-center'
                        }`}
                      >
                        {food.availability === "Available" ? (
                          <><CheckCircle size={12} className="mr-1" /> Available</>
                        ) : (
                          <><XCircle size={12} className="mr-1" /> Unavailable</>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-2">
                    {food.description || "No description available"}
                  </p>
                  
                  <div className="mt-3 flex items-center">
                    <Tag size={14} className="text-indigo-400 mr-1" />
                    <span className="text-xs text-gray-500 bg-indigo-50 px-2 py-1 rounded">
                      {food.category.charAt(0).toUpperCase() + food.category.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodLists;