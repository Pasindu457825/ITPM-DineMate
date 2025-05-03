import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import deleteOrder from "../order/DeleteOrder"; // Ensure correct path
import Swal from "sweetalert2";
import jsPDF from "jspdf"; // ✅ new
import html2canvas from "html2canvas"; // ✅ new
import logo from "../../../../assets/logo/Picture1.png"; // ✅ Correct import for React assets

const OrderDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const orderRef = useRef(); // ✅ Ref to capture div for PDF

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

  const drawField = (pdf, label, value, x, y) => {
    pdf.setFont("Helvetica", "bold");
    pdf.text(label, x, y);
    pdf.setFont("Helvetica", "normal");
    pdf.text(value, x + 40, y); // little right side for value
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();

    const loadImage = (url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.src = url;
      });

    loadImage(logo).then((logoImg) => {
      const pageWidth = pdf.internal.pageSize.getWidth();

      // --- Draw Logo Left ---
      const logoWidth = 25;
      const logoHeight = 25;
      const logoX = 20;
      const logoY = 20;

      pdf.addImage(logoImg, "PNG", logoX, logoY, logoWidth, logoHeight);

      // --- Draw "DineMate" Text Centered ---
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(25);
      pdf.setTextColor(30, 64, 175);

      const textY = logoY + logoHeight / 2 + 5; // nicely aligned vertically
      pdf.text("DineMate", pageWidth / 2, textY, { align: "center" }); // ✅ centered horizontally

      // --- Divider Line ---
      const dividerY = logoY + logoHeight + 10;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, dividerY, pageWidth - 20, dividerY);

      // --- Order Details Title ---
      pdf.setFontSize(16);
      pdf.setTextColor(55, 65, 81);
      pdf.text("Order Details", pageWidth / 2, dividerY + 10, {
        align: "center",
      });

      let y = dividerY + 20;

      // --- Helper function for fields ---
      const drawField = (label, value, x, y) => {
        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(label, x, y);
        const labelWidth = pdf.getTextWidth(label);
        pdf.setFont("Helvetica", "normal");
        pdf.text(value, x + labelWidth + 2, y);
      };

      // --- ORDER DETAILS Section ---
      drawField("Order ID:", order.orderId, 20, y);
      y += 7;
      drawField("Restaurant:", order.restaurantName || "N/A", 20, y);
      y += 7;
      drawField("Customer Name:", order.customerName, 20, y);
      y += 7;
      drawField("Email:", order.customerEmail, 20, y);
      y += 7;
      drawField("Order Type:", order.orderType, 20, y);
      y += 7;
      drawField(
        "Payment Method:",
        order.paymentType?.paymentMethod || "N/A",
        20,
        y
      );
      y += 7;
      drawField(
        "Payment Status:",
        order.paymentType?.paymentStatus || "N/A",
        20,
        y
      );
      y += 7;
      drawField("Status:", order.orderStatus, 20, y);

      // --- Divider Line ---
      y += 10;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, y, pageWidth - 20, y);
      y += 10;

      // --- ORDERED ITEMS Title ---
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(55, 65, 81);
      pdf.text("Ordered Items", 20, y);
      y += 8;

      // --- Ordered Items List ---
      pdf.setFont("Helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      order.items.forEach((item, index) => {
        pdf.text(
          `${index + 1}. ${item.name} - Qty: ${
            item.quantity
          } - Price: Rs.${item.price.toFixed(2)} - Total: Rs.${(
            item.quantity * item.price
          ).toFixed(2)}`,
          20,
          y
        );
        y += 7;
      });

      // --- Divider Line ---
      y += 10;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, y, pageWidth - 20, y);
      y += 10;

      // --- RESERVATION DETAILS Title ---
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(55, 65, 81);
      pdf.text("Reservation Details", 20, y);
      y += 8;

      pdf.setFont("Helvetica", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      if (order.reservationDetails) {
        drawField(
          "Reservation ID:",
          order.reservationDetails.reservationId,
          20,
          y
        );
        y += 7;
        drawField("Date:", order.reservationDetails.date, 20, y);
        y += 7;
        drawField("Time:", order.reservationDetails.time, 20, y);
        y += 7;
        drawField(
          "Guests:",
          order.reservationDetails.NoofPerson.toString(),
          20,
          y
        );
        y += 7;
        drawField("Table No.:", order.reservationDetails.tableNumber, 20, y);
        y += 7;
        if (order.reservationDetails.specialRequests) {
          drawField(
            "Requests:",
            order.reservationDetails.specialRequests,
            20,
            y
          );
          y += 7;
        }
      } else {
        pdf.text("No reservation details available.", 20, y);
        y += 7;
      }

      // --- Divider Line ---
      y += 10;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, y, pageWidth - 20, y);
      y += 10;

      // --- TOTAL AMOUNT Section ---
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(34, 197, 94); // Green
      pdf.text(`Total Amount: Rs.${order.total.toFixed(2)}`, 20, y);

      // --- Footer: Thank You ---
      y += 20;
      pdf.setFontSize(12);
      pdf.setTextColor(30, 64, 175);
      pdf.text("Thank you for ordering with DineMate!", pageWidth / 2, y, {
        align: "center",
      });

      // --- Save PDF ---
      pdf.save(`Order_${order.orderId}.pdf`);
    });
  };

  return (
    <div
      className="p-10 max-w-5xl mx-auto bg-white shadow-xl rounded-3xl space-y-10"
      ref={orderRef}
    >
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

      {/* Reservation Details */}
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
      <div className="flex justify-center items-center space-x-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300"
        >
          ⬅️ Back to Orders
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300"
        >
          📄 Download as PDF
        </button>
        <button
          onClick={handleDeleteOrder}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300"
        >
          🗑️ Delete Order
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
