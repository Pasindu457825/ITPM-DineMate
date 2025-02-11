import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import deleteItem from "./DeleteItem"; // Import the delete function

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // Use navigate function for redirection

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ITPM/items/display-items"
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };

    fetchItems();
  }, []);

  // Function to handle item deletion
  const handleDelete = (id) => {
    deleteItem(id, setItems, items); // Call the delete function from delete.js
  };

  // Function to navigate to the update page (passing item ID to pre-fill form)
  const handleUpdate = (id) => {
    navigate(`/update-item/${id}`); // Navigate to Update Item page
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Items List</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id} className="border-b p-4 mb-4 hover:shadow-lg transition duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-4">
              {/* Item Name, Price, and Description */}
              <div className="flex flex-row space-x-8">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
                </div>
                <div className="flex flex-col w-1/2">
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg font-medium text-green-600">${item.price}</p>
                </div>
                
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleUpdate(item._id)}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsList;
