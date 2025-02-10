import React, { useState } from "react";
import axios from "axios";

const AddItemForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure the request data is properly structured
    const itemData = {
      name,
      description,
      price,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/items/add-item",
        itemData
      );
      console.log("Item added:", response.data);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Item Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Item Price"
        value={price}
        onChange={(e) => setPrice(parseInt(e.target.value, 10))}
        required
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItemForm;
