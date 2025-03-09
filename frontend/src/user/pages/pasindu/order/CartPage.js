import React from "react";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ cartOpen, setCartOpen, cart, setCart }) => {
  const navigate = useNavigate(); // Initialize navigation

  const handleQuantityChange = (foodId, increment) => {
    const updatedCart = cart.map((item) =>
      item._id === foodId
        ? { ...item, quantity: Math.max(1, item.quantity + increment) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (foodId) => {
    const updatedCart = cart.filter((item) => item._id !== foodId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
        cartOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      {/* Close Button */}
      <button
        onClick={() => setCartOpen(false)}
        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        ✖ Close
      </button>

      <h2 className="text-xl font-bold text-gray-800 text-center mt-6">Your Cart 🛒</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">Your cart is empty.</p>
      ) : (
        <div className="p-4">
          {cart.map((item) => (
            <div key={item._id} className="border-b pb-3 mb-3 flex items-center">
              <img
                src={item.image || "https://via.placeholder.com/100"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-3 flex-1">
                <h3 className="text-md font-semibold">{item.name}</h3>
                <p className="text-gray-700">${(parseFloat(item.price) || 0).toFixed(2)}</p>

                {/* Quantity Selector */}
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, -1)}
                    className="bg-gray-300 text-black px-3 py-1 rounded-l hover:bg-gray-400 transition"
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, 1)}
                    className="bg-gray-300 text-black px-3 py-1 rounded-r hover:bg-gray-400 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleRemoveItem(item._id)}
                className="ml-3 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
              >
                ✖
              </button>
            </div>
          ))}

          {/* Total Price */}
          <div className="text-lg font-semibold text-right mt-4">
            Total: <span className="text-green-600">${totalPrice.toFixed(2)}</span>
          </div>

          {/* Checkout Button - Navigates to Payment Page */}
          <button
            onClick={() => navigate("/payment")} // Navigate to payment page
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
