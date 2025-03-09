import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form data
  const [restaurant, setRestaurant] = useState({
    name: "",
    description: "",
    location: "",
    phoneNumber: "",
    numberOfTables: "",
    seatsPerTable: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch restaurant details on component mount
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/restaurants/get-restaurant/${id}`
        );
        setRestaurant(response.data); // Set the restaurant data to state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError("Failed to load restaurant details.");
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]); // Re-fetch if the id changes

  // Handle input changes
  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (
      !restaurant.name ||
      !restaurant.location ||
      !restaurant.phoneNumber ||
      !restaurant.numberOfTables ||
      !restaurant.seatsPerTable
    ) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Update restaurant API call
      const response = await axios.put(
        `http://localhost:5000/api/ITPM/restaurants/update-restaurant/${id}`,
        restaurant
      );
      navigate("/"); // Redirect after successful update
    } catch (err) {
      console.error("Error updating restaurant:", err);
      setError("Failed to update restaurant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading restaurant details...</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Update Restaurant
      </h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Restaurant Details */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={restaurant.name}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={restaurant.description}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
          rows="4"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={restaurant.location}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={restaurant.phoneNumber}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          name="numberOfTables"
          placeholder="Number of Tables"
          value={restaurant.numberOfTables}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="number"
          name="seatsPerTable"
          placeholder="Seats Per Table"
          value={restaurant.seatsPerTable}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        {/* Submit Update */}
        <button
          type="submit"
          onClick={() => navigate("/display-restaurant")}
          className="bg-blue-500 text-white p-2 rounded w-full mt-4"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Restaurant"}
        </button>
      </form>

      {/* Button to View Restaurants List */}
      <button
        onClick={() => navigate("/display-restaurant")}
        className="mt-4 bg-green-500 text-white p-2 rounded w-full"
      >
        View Restaurants List
      </button>
    </div>
  );
};

export default UpdateRestaurant;
