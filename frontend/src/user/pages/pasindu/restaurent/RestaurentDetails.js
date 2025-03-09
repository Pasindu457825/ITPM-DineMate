import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CartSidebar from "../order/CartPage"; // Import the sliding cart component

const RestaurantDetails = () => {
  const { id: restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false); // Control sidebar visibility
  const [quantities, setQuantities] = useState({});

  // Load cart from localStorage
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

  // Handle quantity change
  const handleQuantityChange = (foodId, increment) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [foodId]: Math.max(1, (prevQuantities[foodId] || 1) + increment),
    }));
  };

  // Add to cart function
  const handleAddToCart = (food) => {
    const quantity = quantities[food._id] || 1;
    let storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Check if the cart contains items from another restaurant
    if (storedCart.length > 0 && storedCart[0].restaurantId !== restaurantId) {
      const confirmClear = window.confirm(
        "You already have items from another restaurant. Do you want to clear the cart and add items from this restaurant?"
      );
  
      if (confirmClear) {
        // Clear the cart before adding new items
        storedCart = [];
        setCart([]); // Reset state
        localStorage.setItem("cart", JSON.stringify([]));
      } else {
        return; // Stop execution if user cancels
      }
    }
  
    // Check if the food item already exists in the updated cart
    const existingItemIndex = storedCart.findIndex((item) => item._id === food._id);
    let updatedCart;
  
    if (existingItemIndex !== -1) {
      updatedCart = storedCart.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCart = [...storedCart, { ...food, quantity, restaurantId }];
    }
  
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save the new cart state
  };

  if (!restaurant) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      {/* View Cart Button */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
      >
        View Cart 🛒
      </button>

      {/* Restaurant Name */}
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">{restaurant.name}</h1>

      {/* Restaurant Image */}
      <img
        src={restaurant.image || "https://via.placeholder.com/600"}
        alt={restaurant.name}
        className="w-full h-64 object-cover rounded-lg shadow-md"
      />

      {/* Restaurant Details */}
      <div className="mt-6 space-y-4">
        <p className="text-lg text-gray-700"><strong>Description:</strong> {restaurant.description}</p>
        <p className="text-lg text-gray-700"><strong>Location:</strong> {restaurant.location}</p>
        <p className="text-lg text-gray-700"><strong>Phone:</strong> {restaurant.phoneNumber}</p>
      </div>

      {/* Food Items */}
      <h2 className="text-2xl font-bold text-gray-800 mt-8">Food Menu</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {foods.map((food) => (
          <li key={food._id} className="border p-4 rounded shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-semibold">{food.name}</h3>
            <p className="text-gray-700">{food.description}</p>
            <p className="text-green-600 font-bold">${food.price.toFixed(2)}</p>

            {/* Food Image */}
            {food.image && (
              <img src={food.image} alt={food.name} className="w-40 h-40 object-cover rounded mt-2" />
            )}

            {/* Quantity Selector */}
            <div className="flex items-center mt-3">
              <button
                onClick={() => handleQuantityChange(food._id, -1)}
                className="bg-gray-300 text-black px-3 py-1 rounded-l hover:bg-gray-400"
                disabled={(quantities[food._id] || 1) === 1}
              >
                -
              </button>
              <span className="px-4 py-1 border">{quantities[food._id] || 1}</span>
              <button
                onClick={() => handleQuantityChange(food._id, 1)}
                className="bg-gray-300 text-black px-3 py-1 rounded-r hover:bg-gray-400"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(food)}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>

      {/* Sliding Cart Sidebar */}
      <CartSidebar cartOpen={cartOpen} setCartOpen={setCartOpen} cart={cart} setCart={setCart} />
    </div>
  );
};

export default RestaurantDetails;
