import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ITPM/restaurants/get-all-restaurants"
        );
        const enabledRestaurants = response.data.filter(
          (restaurant) => restaurant.isEnabled
        );
        setRestaurants(enabledRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 👇 Embedded version of the BackgroundBlogCard component
  const BackgroundBlogCard = ({ image, title, subtitle, avatar, onClick }) => (
    <Card
      shadow={false}
      className="relative grid h-[30rem] w-full max-w-[28rem] items-end justify-center overflow-hidden text-center cursor-pointer"
      onClick={onClick}
    >
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 m-0 h-full w-full rounded-none"
      >
        <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </CardHeader>
      <CardBody className="relative py-14 px-6 md:px-12">
        <Typography
          variant="h4"
          color="white"
          className="mb-2 font-semibold leading-snug"
        >
          {title}
        </Typography>
        <Typography variant="h6" className="mb-4 text-gray-300">
          {subtitle}
        </Typography>
        <Avatar
          size="xl"
          variant="circular"
          alt={title}
          className="border-2 border-white mx-auto"
          src={avatar}
        />
      </CardBody>
    </Card>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Restaurants List
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center gap-2">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md w-full max-w-md text-gray-800 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Clear
          </button>
        )}
      </div>

      {filteredRestaurants.length === 0 ? (
        <p className="text-gray-500 text-center">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <BackgroundBlogCard
              key={restaurant._id}
              image={restaurant.image || "https://via.placeholder.com/300"}
              title={restaurant.name}
              subtitle={restaurant.location}
              avatar={
                restaurant.image ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=1480&q=80"
              }
              onClick={() =>
                navigate(`/user/restaurent-details/${restaurant._id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
