import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    phoneNumber: "",
    numberOfTables: "",
    seatsPerTable: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData); // Log the form data

    try {
      // Make the API call to create the restaurant
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/restaurants/create-restaurant",
        formData
      );
      console.log("Restaurant created successfully:", response.data); // Log success response
      navigate("/"); // Redirect after successful restaurant creation
    } catch (error) {
      console.error(
        "Error creating restaurant:",
        error.response || error.message
      ); // Log any errors
    }
  };

  const handleGoBack = () => {
    navigate("/display-restaurant"); // Navigate back to Restaurant List
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Create Restaurant
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Restaurant Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of Tables
          </label>
          <input
            type="number"
            name="numberOfTables"
            value={formData.numberOfTables}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Seats Per Table
          </label>
          <input
            type="number"
            name="seatsPerTable"
            value={formData.seatsPerTable}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full mt-4"
        >
          Create Restaurant
        </button>
      </form>

      {/* Back to Restaurant List Button */}
      <button
        onClick={handleGoBack}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
      >
        Back to Restaurant List
      </button>
    </div>
  );
};

export default CreateRestaurant;
