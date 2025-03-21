import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagerHeader from "../../../components/ManagerHeader";
import ManagerFooter from "../../../components/ManagerFooter";

const MyRestaurant = () => {
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
      
      // Get the userId from localStorage (saved during login)
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setError("You must be logged in to view your restaurants");
        setLoading(false);
        toast.error("Please login to view your restaurants", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      
      console.log("Fetching restaurants for manager ID:", userId);
      
      // Include userId as a query parameter to filter restaurants
      const response = await axios.get(`http://localhost:5000/api/ITPM/restaurants/get-all-restaurants-id?userId=${userId}`);
      
      setRestaurants(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError(error.response?.data?.message || "Failed to load restaurants");
      setLoading(false);
      toast.error("Failed to load restaurants", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        const userId = localStorage.getItem("userId");
        // Include userId in the request for authorization
        await axios.delete(`http://localhost:5000/api/ITPM/restaurants/delete-restaurant/${id}?userId=${userId}`);
        toast.success("Restaurant deleted successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: "🗑️",
        });
        fetchRestaurants(); // Refresh the list
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        toast.error(error.response?.data?.message || "Failed to delete restaurant", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <ManagerHeader />
      <br/>
      <br/>
      <ToastContainer />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-amber-800 tracking-tight mb-2">My Restaurants</h1>
              <p className="text-gray-600 max-w-lg">Manage all your restaurant listings and menus from one convenient dashboard.</p>
            </div>
            <Link
  to="/add-restaurant"
  className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 transform hover:scale-105"
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
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
              <p className="mt-4 text-amber-600 font-medium">Loading your restaurants...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md" role="alert">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
              <p className="mt-2 text-red-600">Please try again or contact support if the issue persists.</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="bg-white border border-amber-100 rounded-2xl shadow-xl p-10 text-center">
              <div className="bg-amber-50 mx-auto rounded-full w-20 h-20 flex items-center justify-center">
                <svg
                  className="h-10 w-10 text-amber-500"
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
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">No restaurants yet</h3>
              <p className="mt-2 text-gray-600">Start your journey by adding your first restaurant.</p>
              <div className="mt-8">
                <Link
                  to="/create-restaurant"
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-md text-base font-medium rounded-full text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
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
                  Create Your First Restaurant
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className={`bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${!restaurant.isEnabled ? 'opacity-60' : ''}`}
                >
                  <div className="h-56 relative overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    {!restaurant.isEnabled && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg px-4 py-2 bg-red-500 rounded-full">Disabled</span>
                      </div>
                    )}
                  </div>
                  <div className="px-6 py-5">
                    <h3 className="text-xl font-bold text-gray-900 truncate">
                      {restaurant.name}
                    </h3>
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {restaurant.description}
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{restaurant.location}</span>
                      </div>
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-gray-700">{restaurant.phoneNumber}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                        Available Tables
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {restaurant.tables.map((table, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                          >
                            {table.quantity} × {table.seats}-seater
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                    {restaurant.isEnabled ? (
                      <div className="flex flex-wrap gap-2">
                        <Link 
                          to={`/update-restaurant/${restaurant._id}`} 
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                        >
                          <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </Link>
                        <Link 
                          to={`/restaurant/foods/${restaurant._id}`} 
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                          <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          Menu
                        </Link>
                        <button 
                          onClick={() => navigate(`/add-food/${restaurant._id}`)} 
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Add Foods
                        </button>
                        <button 
                          onClick={() => handleDeleteRestaurant(restaurant._id)} 
                          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                          <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zm-9.782 6.015a8 8 0 1111.395-11.396 8 8 0 01-11.395 11.396z" clipRule="evenodd" />
                          </svg>
                          This restaurant is currently disabled
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <ManagerFooter />
    </div>
  );
};

export default MyRestaurant;