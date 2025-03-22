import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import deleteOrder from "../order/DeleteOrder"; // Ensure correct path
import Swal from "sweetalert2";

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

  const handleDeleteOrder = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrder(order.orderId, navigate);
        Swal.fire({
          title: "Deleted!",
          text: "The order has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="p-10 max-w-5xl mx-auto bg-white shadow-xl rounded-3xl space-y-10">
      {/* Header */}
      <h2
        className="text-5xl font-bold text-center text-gray-800"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Order Details
      </h2>

      {/* Order Summary */}
      <section className="bg-gray-50 p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Order ID: <span className="font-normal">{order.orderId}</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
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
            <strong>Payment Status:</strong>{" "}
            {order.paymentType?.paymentStatus || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {order.orderStatus}
          </p>
        </div>
        <p className="text-xl font-bold text-green-600 mt-4">
          Total Amount: Rs.{order.total.toFixed(2)}
        </p>
      </section>

      {/* Ordered Items */}
      <section>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ordered Items</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md text-sm text-gray-500">
                  No Image Available
                </div>
              )}
              <h4 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h4>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-600">Price: Rs.{item.price.toFixed(2)}</p>
              <p className="text-green-600 font-semibold">
                Total: Rs.{(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Reservation Details (Optional) */}
      {order.reservationDetails && (
        <section className="bg-gray-50 p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Reservation Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Reservation ID:</strong>{" "}
              {order.reservationDetails.reservationId}
            </p>
            <p>
              <strong>Date:</strong> {order.reservationDetails.date}
            </p>
            <p>
              <strong>Time:</strong> {order.reservationDetails.time}
            </p>
            <p>
              <strong>Guests:</strong> {order.reservationDetails.NoofPerson}
            </p>
            <p>
              <strong>Table No.:</strong> {order.reservationDetails.tableNumber}
            </p>
            {order.reservationDetails.specialRequests && (
              <p>
                <strong>Requests:</strong>{" "}
                {order.reservationDetails.specialRequests}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition font-medium"
        >
          Back to Orders
        </button>
        <button
          onClick={handleDeleteOrder}
          className="bg-red-600 text-white px-6 py-3 ml-3 rounded-lg hover:bg-red-700 transition font-medium"
        >
          Delete Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
