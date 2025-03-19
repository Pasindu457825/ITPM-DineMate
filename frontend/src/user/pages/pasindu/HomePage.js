// HomePage.js
import React from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    // Remove items from localStorage (token, role, userId)
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    alert("You have been logged out.");
    // Navigate back to the login page or home as needed
    navigate("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to the Home Page</h1>
      <div className="flex space-x-4 mb-6">

        <Button 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-600"
          onClick={() => navigate("/add-order")}  // Navigate to Add Order page
        >
          Add Order
        </Button>

        <Button 
          className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-green-600"
          onClick={() => navigate("/add-reservation")}  // Navigate to Add Reservation page
        >
          Add Reservation
        </Button>
      </div>

      <Button 
        className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-600"
        onClick={handleLogout}
      >
        Logout
      </Button>

      <Button 
          className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-green-600"
          onClick={() => navigate("/me")}  // Navigate to Add Reservation page
        >
          my profile
        </Button>
    </div>
  );
};

export default HomePage;
