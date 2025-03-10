import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CartSidebar from "../order/CartPage";

const RestaurantDetails = () => {
  const { id: restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const fetchRestaurantAndFoods = async () => {
      try {
        const restaurantResponse = await axios.get(
          `http://localhost:5000/api/ITPM/restaurants/get-restaurant/${restaurantId}`
        );
        const foodsResponse = await axios.get(
          `http://localhost:5000/api/ITPM/foodItems/restaurant/foods/${restaurantId}`
        );

        setRestaurant(restaurantResponse.data);
        setFoods(foodsResponse.data.foods || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRestaurantAndFoods();
  }, [restaurantId]);

  const handleQuantityChange = (foodId, increment) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [foodId]: Math.max(1, (prevQuantities[foodId] || 1) + increment),
    }));
  };

  const handleAddToCart = (food) => {
    const quantity = quantities[food._id] || 1;
    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (storedCart.length > 0 && storedCart[0].restaurantId !== restaurantId) {
      const confirmClear = window.confirm(
        "You already have items from another restaurant. Do you want to clear the cart and add items from this restaurant?"
      );

      if (confirmClear) {
        storedCart = [];
        setCart([]);
        localStorage.setItem("cart", JSON.stringify([]));
      } else {
        return;
      }
    }

    const existingItemIndex = storedCart.findIndex(
      (item) => item._id === food._id
    );
    let updatedCart;

    if (existingItemIndex !== -1) {
      updatedCart = storedCart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [...storedCart, { ...food, quantity, restaurantId }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  if (!restaurant)
    return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <button
        onClick={() => setCartOpen(true)}
        className="fixed top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
      >
        View Cart 🛒
      </button>

      <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
        {restaurant.name}
      </h1>
      <img
        src={restaurant.image || "https://via.placeholder.com/600"}
        alt={restaurant.name}
        className="w-full h-64 object-cover rounded-lg shadow-md"
      />

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
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-8">Food Menu</h2>

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          placeholder="Search food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Navigate Button to CreateReservation */}
      <button
        onClick={() =>
          navigate(`/add-reservation/${restaurantId}`, {
            state: {
              restaurantId,
              name: restaurant.name,
              numberOfTables: restaurant.numberOfTables,
              seatsPerTable: restaurant.seatsPerTable,
            },
          })
        }
        className="mt-6 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
      >
        Make a Reservation 📅
      </button>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {foods
          .filter((food) =>
            food.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((food) => (
            <li
              key={food._id}
              className="border p-4 rounded shadow-lg flex flex-col items-center"
            >
              <h3 className="text-lg font-semibold">{food.name}</h3>
              <p className="text-gray-700">{food.description}</p>
              <p className="text-green-600 font-bold">
                ${food.price.toFixed(2)}
              </p>

              {food.image && (
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-40 h-40 object-cover rounded mt-2"
                />
              )}

              <div className="flex items-center mt-3">
                <button
                  onClick={() => handleQuantityChange(food._id, -1)}
                  className="bg-gray-300 text-black px-3 py-1 rounded-l hover:bg-gray-400"
                  disabled={(quantities[food._id] || 1) === 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border">
                  {quantities[food._id] || 1}
                </span>
                <button
                  onClick={() => handleQuantityChange(food._id, 1)}
                  className="bg-gray-300 text-black px-3 py-1 rounded-r hover:bg-gray-400"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(food)}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
            </li>
          ))}
      </ul>

      <CartSidebar
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cart={cart}
        setCart={setCart}
      />
    </div>
  );
};

export default RestaurantDetails;
