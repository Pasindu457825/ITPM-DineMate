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
      <h1 className="text-3xl font-bold underline">Items List</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id} className="border-b p-4">
            <h2 className="text-xl">{item.name}</h2>
            <p>{item.description}</p>
            <p>${item.price}</p>
            <div className="mt-2">
              {/* Update and Delete buttons */}
              <button
                onClick={() => handleUpdate(item._id)}
                className="bg-yellow-500 text-white p-2 rounded mr-2"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsList;
