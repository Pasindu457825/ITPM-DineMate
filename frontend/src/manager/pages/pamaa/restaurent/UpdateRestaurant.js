import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateRestaurant = () => {
  const { id } = useParams(); // Retrieve the restaurant ID from the URL parameters
  const navigate = useNavigate();

  // State for storing restaurant data and form status
  const [restaurant, setRestaurant] = useState({
    name: "",
    description: "",
    location: "",
    phoneNumber: "",
    tables: [{ seats: "", quantity: "" }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch restaurant data when the component mounts or the ID changes
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/restaurants/get-restaurant/${id}`
        );
        setRestaurant({ ...response.data, tables: response.data.tables || [{ seats: "", quantity: "" }] });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError("Failed to load restaurant details.");
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  // Handle form input changes
  const handleChange = (e, index) => {
    if (["seats", "quantity"].includes(e.target.name)) {
      const newTables = [...restaurant.tables];
      newTables[index][e.target.name] = e.target.value;
      setRestaurant({ ...restaurant, tables: newTables });
    } else {
      setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    }
  };

  // Add new table configuration
  const addTable = () => {
    setRestaurant({
      ...restaurant,
      tables: [...restaurant.tables, { seats: "", quantity: "" }]
    });
  };

  // Remove table configuration
  const removeTable = (index) => {
    const newTables = [...restaurant.tables];
    newTables.splice(index, 1);
    setRestaurant({ ...restaurant, tables: newTables });
  };

  // Handle form submission for updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/ITPM/restaurants/update-restaurant/${id}`,
        restaurant
      );
      alert("Restaurant updated successfully!");
      navigate("/display-restaurant"); // Redirect to the restaurant list after update
    } catch (err) {
      console.error("Error updating restaurant:", err);
      setError("Failed to update restaurant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading restaurant details...</p>; // Display loading state while data is being fetched
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Update Restaurant
      </h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "description", "location", "phoneNumber"].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              name={field}
              value={restaurant[field]}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
        ))}

        {restaurant.tables.map((table, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Seats per Table
              </label>
              <input
                type="number"
                name="seats"
                placeholder="Seats per Table"
                value={table.seats}
                onChange={(e) => handleChange(e, index)}
                required
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Number of Tables
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="Number of Tables"
                value={table.quantity}
                onChange={(e) => handleChange(e, index)}
                required
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeTable(index)}
                style={{ width: '20%' }}
                className="bg-red-500 text-white py-2 rounded-full text-xs"
                title="Remove this table type"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addTable}
          className="mt-2 bg-green-500 text-white p-2 rounded flex items-center justify-center"
        >
          Add Table
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mt-4"
        >
          Update Restaurant
        </button>
      </form>
      <button
        onClick={() => navigate("/display-restaurant")}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
      >
        Back to Restaurant List
      </button>
    </div>
  );
};

export default UpdateRestaurant;
