import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import deleteFood from "../foodmenu/DeleteFood"; // Ensure this is the correct import path
import ManagerHeader from "../../../components/ManagerHeader";
import ManagerFooter from "../../../components/ManagerFooter";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodsByRestaurant = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Fetching and setting food data
    if (!restaurantId || restaurantId === ":restaurantId") {
      console.error("Error: Invalid restaurantId received!");
      setError("Invalid restaurant ID.");
      toast.error("Invalid restaurant ID.");
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
          toast.success("Food items loaded successfully!");
        } else {
          throw new Error("Invalid API response structure.");
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
        setError("Failed to fetch food items.");
        toast.error("Failed to fetch food items.");
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
    toast.success("Food item deleted successfully!");
  };

  const handleUpdate = (foodId) => {
    navigate(`/update-food/${foodId}`);
  };

  const handleAddFood = () => {
    navigate(`/add-food/${restaurantId}`);
  };

  const toggleAvailability = async (foodId, currentAvailability) => {
    try {
      console.log(
        `Toggling availability for foodId: ${foodId}, Current: ${currentAvailability}`
      ); 

      const response = await axios.patch(
        `http://localhost:5000/api/ITPM/foodItems/toggle-availability/${foodId}`
      );

      if (response.status === 200) {
        setFoods((prevFoods) =>
          prevFoods.map((food) =>
            food._id === foodId
              ? { ...food, availability: response.data.foodItem.availability }
              : food
          )
        );
        toast.info(`Food item is now ${response.data.foodItem.availability}`);
      } else {
        throw new Error("Failed to update availability.");
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      setError("Failed to toggle availability.");
      toast.error("Failed to update availability.");
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading food items...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div>
      <ManagerHeader />
      <br/><br/><br/>
      <div className="p-6 bg-[#E9E4E4] min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-between items-center mb-6 border-b border-[#276265] pb-3">
          <h2 className="text-3xl font-bold text-gray-800">{restaurantName} - Food Menu</h2>
          <button 
            onClick={handleAddFood}
            className="bg-[#276265] hover:bg-[#1e4e50] text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Food Item
          </button>
        </div>
        <div className="flex items-center space-x-4 mb-6">
          {/* Search Input with Icon */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#276265]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by food name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 border border-gray-300 p-3 rounded-lg bg-white text-gray-700 
                       focus:border-[#276265] focus:ring-2 focus:ring-[#27626540] focus:outline-none 
                       transition duration-200 ease-in-out h-12 shadow-sm"
            />
          </div>

          {/* Category Dropdown with Icon */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#276265]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-8 border border-gray-300 p-3 rounded-lg bg-white text-gray-700 
                       focus:border-[#276265] focus:ring-2 focus:ring-[#27626540] focus:outline-none 
                       appearance-none transition duration-200 ease-in-out h-12 shadow-sm"
            >
              <option value="" className="text-gray-700">All Categories</option>
              <option value="salad" className="text-gray-700">Salad</option>
              <option value="rolls" className="text-gray-700">Rolls</option>
              <option value="desserts" className="text-gray-700">Desserts</option>
              <option value="sandwich" className="text-gray-700">Sandwich</option>
              <option value="cake" className="text-gray-700">Cake</option>
              <option value="pure veg" className="text-gray-700">Pure Veg</option>
              <option value="pasta" className="text-gray-700">Pasta</option>
              <option value="noodles" className="text-gray-700">Noodles</option>
              <option value="beverages" className="text-gray-700">Beverages</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#276265]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </div>
        </div>
        {filteredFoods.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-600 p-6 bg-white rounded-lg shadow-sm mb-4">No matching food items found.</p>
            <button 
              onClick={handleAddFood}
              className="bg-[#276265] hover:bg-[#1e4e50] text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200 flex items-center mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Food Item
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filteredFoods.map((food) => (
              <li
                key={food._id}
                className="border border-gray-200 p-4 rounded-lg bg-white shadow-md flex flex-col items-center transform transition-transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{food.name}</h3>
                {food.image && (
                  <div className="w-full h-40 overflow-hidden rounded-lg mb-3 border border-gray-200">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                    />
                  </div>
                )}
                <p className="text-gray-600 text-center mb-3 text-sm">{food.description}</p>
                <p className="text-[#276265] font-bold text-lg mb-2">
                  Rs.{food.price.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mb-1">Category: <span className="text-gray-700">{food.category}</span></p>
                <p className="text-xs text-gray-500 mb-3">
                  Status:{" "}
                  {food.availability === "Available" ? (
                    <span className="text-green-500 font-semibold">
                      Available
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Unavailable
                    </span>
                  )}
                </p>

                <div className="flex gap-2 mt-1 w-full justify-center">
                  <button
                    onClick={() => handleUpdate(food._id)}
                    className="bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300 transition-colors shadow-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(food._id)}
                    className="bg-red-100 text-red-700 py-1 px-3 rounded text-sm hover:bg-red-200 transition-colors shadow-sm"
                  >
                    Delete
                  </button>
                </div>

                <button
                  onClick={() => toggleAvailability(food._id, food.availability)}
                  className={`mt-2 w-full ${
                    food.availability === "Available"
                      ? "bg-[#27626530] text-[#276265] hover:bg-[#27626540]"
                      : "bg-[#27626540] text-[#276265] hover:bg-[#27626550]"
                  } py-1 px-3 rounded text-sm transition-colors shadow-sm`}
                >
                  {food.availability === "Available"
                    ? "Make Unavailable"
                    : "Make Available"}
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {/* Floating Add Button for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden">
          <button 
            onClick={handleAddFood}
            className="bg-[#276265] hover:bg-[#1e4e50] text-white rounded-full p-4 shadow-lg transition-colors duration-200"
            aria-label="Add New Food Item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      <ManagerFooter/>
    </div>
  );
};

export default FoodsByRestaurant;