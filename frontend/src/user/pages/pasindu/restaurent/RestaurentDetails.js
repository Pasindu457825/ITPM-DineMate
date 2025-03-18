import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import CartSidebar from "../order/CartPage";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const RestaurantDetails = () => {
  const { id: restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState(""); // Track order type
  const navigate = useNavigate(); // Initialize navigate function

  const location = useLocation(); // ✅ Add useLocation()

  // Retrieve reservationId from state
  const { reservationId } = location.state || {};

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
    if (!orderType) {
      alert("Please select an order type before adding items.");
      return;
    }

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
      updatedCart = [
        ...storedCart,
        { ...food, quantity, restaurantId, orderType },
      ];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  if (!restaurant)
    return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <>
      <div className="bg-gray-200">
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

          <CartSidebar
            cartOpen={cartOpen}
            setCartOpen={setCartOpen}
            cart={cart}
            setCart={setCart}
            orderType={orderType}
            reservationId={reservationId}
          />
        </div>

        <div className="w-full max-w-7xl mx-auto ">
          <h2 className="text-2xl font-bold text-gray-800 mt-8">Food Menu</h2>

          {/* Order Type Selection */}
          <div className="mt-4">
            <label className="block text-lg font-semibold mb-2">
              Order Type:
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Order Type</option>
              <option value="Dine-in">Dine-in</option>
              <option value="Takeaway">Takeaway</option>
            </select>
          </div>

          {/* Search Bar */}
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

          {/* Make a Reservation Button */}
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

          {reservationId && (
            <p className="text-lg font-semibold text-green-500">
              ✅ Your reservation has been created successfully! (ID:{" "}
              {reservationId})
            </p>
          )}

          <ul className="bg-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
            {foods
              .filter((food) =>
                food.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((food) => (
                <li key={food._id} className="w-full max-w-[24rem]">
                  <Card className="max-w-[24rem] overflow-hidden shadow-lg  bg-blue-gray-900 transition-transform transform hover:scale-105 flex flex-col">
                    {/* Food Image Section */}
                    <CardHeader
                      floated={false}
                      shadow={false}
                      color="transparent"
                      className="m-0 rounded-none w-full h-40"
                    >
                      <img
                        src={food.image || "/fallback-image.png"}
                        alt={food.name}
                        className="h-full w-full object-cover rounded-bl-[20%]"
                      />
                    </CardHeader>

                    {/* Food Details Section */}
                    <CardBody>
                      <Typography variant="h4" color="white">
                        {food.name}
                      </Typography>
                      <Typography
                        variant="small"
                        color="white"
                        className="mt-3 font-normal"
                      >
                        {food.description}
                      </Typography>
                    </CardBody>

                    {/* Footer with avatars and price */}
                    <CardFooter className="flex items-center justify-between">
                      <Typography color="white" className="font-medium">
                        ${food.price.toFixed(2)}
                      </Typography>
                      <Button
                        onClick={() => handleAddToCart(food)}
                        ripple={false}
                        fullWidth={false}
                        className="bg-amber-700 text-white shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100 rounded-full w-12 h-12 flex items-center justify-center"
                      >
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="w-5 h-5 text-white"
                        />
                      </Button>
                    </CardFooter>
                  </Card>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default RestaurantDetails;
