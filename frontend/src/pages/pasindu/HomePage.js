// HomePage.js
import React from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const HomePage = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  const handleButtonClick = () => {
    navigate("/add-item");  // Navigate to the AddItem page
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Welcome to the Home Page</h1>
      <Button 
        className="bg-blue-500 text-white" 
        onClick={handleButtonClick} // Handle button click to navigate
      >
        Add Item
      </Button>
    </div>
  );
};

export default HomePage;
