import React from "react";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({
  cartOpen,
  setCartOpen,
  cart,
  setCart,
  orderType,
  reservationId,
}) => {
  const navigate = useNavigate();

  // Assuming all items in the cart are from the same restaurant
  const restaurantId = cart.length > 0 ? cart[0].restaurantId : "";
  const restaurantName =
    cart.length > 0 ? cart[0].restaurantName : "Unknown Restaurant"; // Assuming name is included in cart items

  const handleQuantityChange = (foodId, increment) => {
    const updatedCart = cart.map((item) =>
      item._id === foodId
        ? { ...item, quantity: Math.max(1, item.quantity + increment) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (foodId, portionSize) => {
    const updatedCart = cart.filter(
      (item) => !(item._id === foodId && item.portionSize === portionSize)
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + (parseFloat(item.price) || 0) * item.quantity,
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[350px] bg-white shadow-2xl transform ${
        cartOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out flex flex-col rounded-l-2xl`}
    >
      {/* Top Section: Close Button */}
      <div className="flex justify-between items-center p-5 border-b shadow-md bg-gray-100 rounded-t-2xl">
        <h2 className="text-2xl pl-6 font-bold text-gray-800">Your Cart 🛒</h2>
        <button
          onClick={() => setCartOpen(false)}
          className="bg-red-500 text-white w-10 h-10 flex items-center justify-center text-lg font-semibold rounded-full shadow-lg hover:bg-red-600 transition"
        >
          ✖
        </button>
      </div>

      {/* Cart Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">
            Your cart is empty.
          </p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item._id}
                className="border-b pb-4 mb-4 flex items-center gap-4 "
              >
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-gray-700 text-md">
                    Rs. {(parseFloat(item.price) || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    🍽️ Portion: {item.portionSize || "Medium"}
                  </p>

                  {/* Quantity Selector */}
                  <div className="flex items-center mt-3 gap-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, -1)}
                      className="bg-gray-300 text-black px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-400 transition disabled:opacity-50"
                      disabled={item.quantity === 1}
                    >
                      −
                    </button>
                    <span className="px-4 py-1.5 border text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item._id, 1)}
                      className="bg-gray-300 text-black px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-400 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item._id, item.portionSize)}
                  className="ml-2 bg-red-500 text-white w-9 h-9 flex items-center justify-center text-md font-semibold rounded-full shadow-lg hover:bg-red-600 transition"
                >
                  ✖
                </button>
              </div>
            ))}

            <div className="text-xl font-semibold text-right mt-6">
              Total:{" "}
              <span className="text-green-600 font-bold">
                Rs. {totalPrice.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Checkout Button */}
      {cart.length > 0 && (
        <div className="p-6 border-t shadow-md bg-gray-100 rounded-b-2xl">
          <button
            onClick={() => {
              if (!orderType) {
                alert(
                  "Please select an order type before proceeding to checkout."
                );
                return;
              }

              sessionStorage.setItem("cart", JSON.stringify(cart));

              navigate("/add-order-details", {
                state: {
                  restaurantId,
                  restaurantName,
                  cart: cart.map((item) => ({
                    ...item,
                    portionSize: item.portionSize || "Medium",
                  })),
                  orderType,
                  reservationId,
                },
              });
            }}
            className="w-full bg-amber-700 text-white text-lg px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-amber-00 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
