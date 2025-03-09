import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RestaurantDetails = () => {
  const { id } = useParams(); // Get restaurant ID from URL
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/restaurants/get-restaurant/${id}`
        );
        setRestaurant(response.data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (!restaurant) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Restaurant Name */}
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
        {restaurant.name}
      </h1>

      {/* Restaurant Image */}
      <img
        src={restaurant.image || "https://via.placeholder.com/600"}
        alt={restaurant.name}
        className="w-full h-64 object-cover rounded-lg shadow-md"
      />

      {/* Restaurant Details Section */}
      <div className="mt-6 space-y-4">
        <p className="text-lg text-gray-700">
          <strong>Description:</strong> {restaurant.description}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Location:</strong> {restaurant.location}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Phone:</strong> {restaurant.phoneNumber}
        </p>

        {/* Additional Details */}
        <div className="flex justify-between text-lg text-gray-700 mt-4">
          <span><strong>Tables:</strong> {restaurant.numberOfTables}</span>
          <span><strong>Seats:</strong> {restaurant.seatsPerTable}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
