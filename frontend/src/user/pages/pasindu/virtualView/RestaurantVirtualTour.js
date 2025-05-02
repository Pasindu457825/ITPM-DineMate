// src/pages/RestaurantVirtualTour.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VirtualTour from "../virtualView/VirtualTour";

const RestaurantVirtualTour = () => {
  const { id } = useParams();
  const [image360URL, setImage360URL] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/ITPM/restaurants/get-restaurant/${id}`
        );

        // Log the full response payload
        console.log("API response:", res.data);

        // Extract and log the 360° URL from the payload
        const panoUrl = res.data?.image360;
        console.log("⛱️ panorama URL from API:", panoUrl);

        if (panoUrl) {
          setImage360URL(panoUrl);
        } else {
          console.warn("No 360° image found for this restaurant.");
        }
      } catch (err) {
        console.error("Error fetching 360 image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">360° Virtual Tour</h1>

      {loading ? (
        <p>Loading...</p>
      ) : image360URL ? (
        <div className="w-full max-w-4xl">
          <VirtualTour image360URL={image360URL} />
        </div>
      ) : (
        <p className="text-red-500">
          No 360° image available for this restaurant.
        </p>
      )}
    </div>
  );
};

export default RestaurantVirtualTour;
