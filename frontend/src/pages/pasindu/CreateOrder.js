import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddOrderForm = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // State variables for required order details
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [orderType, setOrderType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [total, setTotal] = useState("");
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure total is a number
    const orderTotal = parseFloat(total) || 0;

    // Order object matching backend structure
    const orderData = {
      customerName,
      customerEmail,
      orderType,
      paymentStatus,
      orderStatus,
      total: orderTotal,
      items,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/orders/add-order",
        orderData
      );
      console.log("Order added:", response.data);

      // Redirect to orders list after adding order
      navigate("/display-orders");
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  // Function to handle item updates
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "price" || field === "quantity" ? parseFloat(value) || 0 : value;
    setItems(updatedItems);
  };

  // Add a new item to the list
  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Details */}
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="email"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        {/* Order Details */}
        <input
          type="text"
          placeholder="Order Type"
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Payment Status"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Order Status"
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        {/* Total Price */}
        <input
          type="number"
          placeholder="Total Price"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />

        {/* Order Items */}
        <h3 className="text-lg font-semibold mt-4">Order Items</h3>
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              required
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
        ))}
        <button type="button" onClick={addItem} className="bg-gray-500 text-white p-2 rounded mt-2">
          + Add Item
        </button>

        {/* Submit Order */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mt-4">
          Add Order
        </button>
      </form>

      {/* Button to View Orders List */}
      <button
        onClick={() => navigate("/display-orders")}
        className="mt-4 bg-green-500 text-white p-2 rounded w-full"
      >
        View Orders List
      </button>
    </div>
  );
};

export default AddOrderForm;
