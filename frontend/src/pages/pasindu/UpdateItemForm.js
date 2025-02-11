import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateItemForm = () => {
  const { id } = useParams();  // Get item ID from URL params
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true); // For loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      console.log("Fetching item with ID:", id); // Log the ID to verify
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/items/${id}`
        );
        console.log("Fetched Item: ", response.data);  // Log the response data
        if (response.data) {
          setName(response.data.name);
          setDescription(response.data.description);
          setPrice(response.data.price);
        }
        setLoading(false);  // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching item", error);
        setLoading(false);  // Stop loading in case of error
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedItem = { name, description, price };

    try {
      await axios.put(
        `http://localhost:5000/api/ITPM/items/update-item/${id}`,
        updatedItem
      );
      console.log("Item updated");
      navigate("/display-item");  // Redirect to items list page after updating
    } catch (error) {
      console.error("Error updating item", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Item Name"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        placeholder="Item Description"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        placeholder="Item Price"
        className="p-2 border border-gray-300 rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Update Item
      </button>
    </form>
  );
};

export default UpdateItemForm;
