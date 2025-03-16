import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order; // Get order data from navigation state

  if (!order) {
    return <p className="text-red-500">No order details found.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      <div className="border p-4 rounded bg-white shadow-md">
        <h3 className="text-lg font-semibold">Order ID: {order._id}</h3>
        <p>
          <strong>Restaurant:</strong> {order.restaurantName || "N/A"}
        </p>
        <p>
          <strong>Customer Name:</strong> {order.customerName}
        </p>
        <p>
          <strong>Email:</strong> {order.customerEmail}
        </p>
        <p>
          <strong>Order Type:</strong> {order.orderType}
        </p>
        <p>
          <strong>Payment Method:</strong>{" "}
          {order.paymentType?.paymentMethod || "N/A"}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.paymentType?.paymentStatus}
        </p>
        <p>
          <strong>Status:</strong> {order.orderStatus}
        </p>
        <p>
          <strong>Total Amount:</strong> ${order.total.toFixed(2)}
        </p>

        {/* ✅ Show Order Items with Images */}
        <h3 className="text-lg font-semibold mt-4">Ordered Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded bg-gray-100 shadow-md"
            >
              {/* ✅ Display item image if available */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
              <h4 className="text-lg font-semibold">{item.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p className="font-bold text-green-600">
                Total: ${(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* ✅ Show Full Reservation Details if available */}
        {order.reservationDetails && (
          <div className="border p-4 mt-4 bg-gray-100 rounded">
            <h3 className="text-lg font-semibold">Reservation Details</h3>
            <p>
              <strong>Reservation ID:</strong>{" "}
              {order.reservationDetails.reservationId}
            </p>
            <p>
              <strong>Status:</strong> {order.reservationDetails.status}
            </p>
            <p>
              <strong>Date:</strong> {order.reservationDetails.date}
            </p>
            <p>
              <strong>Time:</strong> {order.reservationDetails.time}
            </p>
            <p>
              <strong>Number of Guests:</strong>{" "}
              {order.reservationDetails.NoofPerson}
            </p>
            {order.reservationDetails.specialRequests && (
              <p>
                <strong>Special Requests:</strong>{" "}
                {order.reservationDetails.specialRequests}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white p-2 rounded mt-4"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
