import React from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import ManagerHeader from "../../components/ManagerHeader";
import ManagerDashboard from "../../components/ManagerDashboard";
import ManagerFooter from "../../components/ManagerFooter";

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
    <div>
 <ManagerHeader/>
    <div className="bg-gray-200 min-h-screen p-6">
      <br/>
      <h1 className="text-3xl font-bold text-blue-gray-900 mb-6">Welcome to the Managers Home Page</h1>
      


      {/* Dashboard Component */}
      <ManagerDashboard />
    </div>
    <ManagerFooter/>
    </div>
  );
};

export default ManagersPage;