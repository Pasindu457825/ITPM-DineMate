import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ManagerHeader from "../../../components/ManagerHeader";
import ManagerFooter from "../../../components/ManagerFooter";
import deleteRestaurant from '../../../../manager/pages/pamaa/restaurent/DeleteRestaurant';

const MyRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      
      // Get the userId from localStorage (saved during login)
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setError("You must be logged in to view your restaurants");
        setLoading(false);
        toast.error("Please login to view your restaurants");
        return;
      }
      
      console.log("Fetching restaurants for manager ID:", userId);
      
      // Include userId as a query parameter to filter restaurants
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

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        const userId = localStorage.getItem("userId");
        // Include userId in the request for authorization
        await axios.delete(`http://localhost:5000/api/ITPM/restaurants/delete-restaurant/${id}?userId=${userId}`);
        toast.success("Restaurant deleted successfully");
        fetchRestaurants(); // Refresh the list
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        toast.error(error.response?.data?.message || "Failed to delete restaurant");
      }
    }
  };

  return (
    <div>
      <ManagerHeader />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Restaurants</h1>
            <Link
              to="/create-restaurant"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="-ml-1 mr-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Restaurant
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No restaurants</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new restaurant.</p>
              <div className="mt-6">
                <Link
                  to="/create-restaurant"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Restaurant
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {restaurants.map((restaurant) => (
    <div
      key={restaurant._id}
      className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 ${!restaurant.isEnabled ? 'opacity-50' : ''}`}
    >
      <div className="h-48 bg-gray-200 relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {restaurant.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {restaurant.description}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium">Location:</span> {restaurant.location}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Phone:</span> {restaurant.phoneNumber}
        </p>
        <div className="mt-2">
          <span className="text-xs font-medium text-gray-600">
            Tables:
          </span>
          <div className="mt-1 flex flex-wrap gap-2">
            {restaurant.tables.map((table, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
              >
                {table.quantity} x {table.seats}-seater
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
        {restaurant.isEnabled ? (
          <div className="flex justify-between space-x-3">
            <Link to={`/update-restaurant/${restaurant._id}`} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
              Edit
            </Link>
            <Link to={`/restaurant/foods/${restaurant._id}`} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Menu
            </Link>
            <button onClick={() => handleDeleteRestaurant(restaurant._id)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete
            </button>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">This restaurant is currently disabled.</p>
        )}
      </div>
    </div>
  ))}
</div>

          )}
        </div>
      </div>
      <ManagerFooter />
    </div>
  );
};

export default MyRestaurant;