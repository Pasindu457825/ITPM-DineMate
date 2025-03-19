import React from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import ManagerHeader from "../../components/ManagerHeader";
import ManagerDashboard from "../../components/ManagerDashboard";

const ManagersPage = () => {
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
    <div className="bg-gray-200 min-h-screen p-6">
      <ManagerHeader/>
      <br/>
      <h1 className="text-3xl font-bold text-blue-gray-900 mb-6">Welcome to the Managers Home Page</h1>
      
      {/* Quick Action Buttons */}
      <div className="flex space-x-4 mb-6">
        <Button 
          variant="outlined"
          color="amber"
          className="bg-amber-700 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-amber-800"
          onClick={() => navigate("/add-restaurant")}
        >
          Add Restaurant
        </Button>
        <Button 
          variant="outlined"
          color="amber"
          className="bg-amber-700 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-amber-800"
          onClick={() => navigate("/me")}
        >
          My Profile
        </Button>
        <Button 
          variant="outlined"
          color="red"
          className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      {/* Dashboard Component */}
      <ManagerDashboard />
    </div>
  );
};

export default ManagersPage;