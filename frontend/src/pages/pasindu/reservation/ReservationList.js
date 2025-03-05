import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import deleteReservation from "./DeleteReservation"; // Import the delete function

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate(); // Use navigate function for redirection

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/ITPM/reservations/get-all-reservations"
        );
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  // Function to handle reservation deletion
  const handleDelete = async (id) => {
    await deleteReservation(id, setReservations, reservations); // Call delete function
  };

  // Function to navigate to the update page (passing reservation ID to pre-fill form)
  const handleUpdate = (id) => {
    navigate(`/update-reservation/${id}`); // Navigate to Update Reservation page
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reservations List</h1>
      {reservations.length === 0 ? (
        <p className="text-gray-500">No reservations found.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((reservation) => (
            <li key={reservation._id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
              <div className="flex flex-col space-y-2">
                {/* Customer Details */}
                <h2 className="text-2xl font-semibold text-gray-800">{reservation.customerName}</h2>
                <p className="text-gray-600">Email: {reservation.customerEmail}</p>

                {/* Reservation Details */}
                <p className="text-gray-700">
                  <strong>Shop Name:</strong> {reservation.shopName}
                </p>
                <p className="text-gray-700">
                  <strong>Table Number:</strong> {reservation.tableNumber}
                </p>
                <p className="text-gray-700">
                  <strong>No. of Persons:</strong> {reservation.NoofPerson}
                </p>
                <p className="text-gray-700">
                  <strong>Date:</strong> {reservation.date}
                </p>
                <p className="text-gray-700">
                  <strong>Time:</strong> {reservation.time}
                </p>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleUpdate(reservation._id)}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(reservation._id)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationList;
