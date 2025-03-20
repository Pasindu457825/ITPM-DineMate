import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg font-semibold">
          No order details found.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Order Details</h2>

      {/* Order Summary */}
      <div className="border p-6 rounded-lg bg-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">
          Order ID: {order.orderId}
        </h3>
        <p className="text-gray-700">
          <strong>Restaurant:</strong> {order.restaurantName || "N/A"}
        </p>
        <p className="text-gray-700">
          <strong>Customer Name:</strong> {order.customerName}
        </p>
        <p className="text-gray-700">
          <strong>Email:</strong> {order.customerEmail}
        </p>
        <p className="text-gray-700">
          <strong>Order Type:</strong> {order.orderType}
        </p>
        <p className="text-gray-700">
          <strong>Payment Method:</strong>{" "}
          {order.paymentType?.paymentMethod || "N/A"}
        </p>
        <p className="text-gray-700">
          <strong>Payment Status:</strong> {order.paymentType?.paymentStatus}
        </p>
        <p className="text-gray-700">
          <strong>Status:</strong> {order.orderStatus}
        </p>
        <p className="text-lg font-bold text-green-600">
          Total Amount: Rs.{order.total.toFixed(2)}
        </p>
      </div>

      {/* Ordered Items */}
      <h3 className="text-xl font-semibold mt-6 mb-4">Ordered Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {order.items.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg bg-white shadow-md">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
            ) : (
              <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-md">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
            <h4 className="text-lg font-semibold">{item.name}</h4>
            <p className="text-gray-700">Quantity: {item.quantity}</p>
            <p className="text-gray-700">Price: Rs.{item.price.toFixed(2)}</p>
            <p className="text-lg font-bold text-green-600">
              Total: Rs.{(item.quantity * item.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Reservation Details */}
      {order.reservationDetails && (
        <div className="border p-6 mt-6 bg-gray-100 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Reservation Details</h3>
          <p className="text-gray-700">
            <strong>Reservation ID:</strong>{" "}
            {order.reservationDetails.reservationId}
          </p>
          <p className="text-gray-700">
            <strong>Date:</strong> {order.reservationDetails.date}
          </p>
          <p className="text-gray-700">
            <strong>Time:</strong> {order.reservationDetails.time}
          </p>
          <p className="text-gray-700">
            <strong>Number of Guests:</strong>{" "}
            {order.reservationDetails.NoofPerson}
          </p>
          <p className="text-gray-700">
            <strong>Table Number:</strong>{" "}
            {order.reservationDetails.tableNumber}
          </p>
          {order.reservationDetails.specialRequests && (
            <p className="text-gray-700">
              <strong>Special Requests:</strong>{" "}
              {order.reservationDetails.specialRequests}
            </p>
          )}
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 text-white px-5 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
