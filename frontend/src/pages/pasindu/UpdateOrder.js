import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateOrderForm = () => {
  const { id } = useParams(); // Get order ID from URL
  const navigate = useNavigate();

  // State variables for order details
  const [order, setOrder] = useState({
    customerName: "",
    customerEmail: "",
    orderType: "",
    paymentStatus: "",
    orderStatus: "",
    total: "",
    items: [{ name: "", quantity: 1, price: 0 }],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch order details on component mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/ITPM/orders/display-orders/${id}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching order details.");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  // Handle item updates
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = field === "price" || field === "quantity" ? parseFloat(value) || 0 : value;
    setOrder({ ...order, items: updatedItems });
  };

  // Add a new item
  const addItem = () => {
    setOrder({ ...order, items: [...order.items, { name: "", quantity: 1, price: 0 }] });
  };

  // Remove an item
  const removeItem = (index) => {
    const updatedItems = order.items.filter((_, i) => i !== index);
    setOrder({ ...order, items: updatedItems });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate inputs
    if (!order.customerName || !order.customerEmail || !order.orderType || !order.paymentStatus || !order.orderStatus) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    if (order.items.length === 0 || order.items.some(item => !item.name || item.quantity <= 0 || item.price < 0)) {
      setError("Please add valid order items.");
      setLoading(false);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/ITPM/orders/update-order/${id}`, order);
      console.log("Order updated successfully");

      // Redirect to orders list after updating order
      navigate("/display-orders");
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center">Loading order details...</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Order</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Details */}
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={order.customerName}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="email"
          name="customerEmail"
          placeholder="Customer Email"
          value={order.customerEmail}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        {/* Order Details */}
        <input
          type="text"
          name="orderType"
          placeholder="Order Type"
          value={order.orderType}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          name="paymentStatus"
          placeholder="Payment Status"
          value={order.paymentStatus}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          name="orderStatus"
          placeholder="Order Status"
          value={order.orderStatus}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        {/* Total Price */}
        <input
          type="number"
          name="total"
          placeholder="Total Price"
          value={order.total}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded w-full"
        />

        {/* Order Items */}
        <h3 className="text-lg font-semibold mt-4">Order Items</h3>
        {order.items.map((item, index) => (
          <div key={index} className="space-y-2 border p-2 rounded">
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
            {order.items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Remove Item
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem} className="bg-gray-500 text-white p-2 rounded mt-2">
          + Add Item
        </button>

        {/* Submit Update */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mt-4" disabled={loading}>
          {loading ? "Updating..." : "Update Order"}
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

export default UpdateOrderForm;
