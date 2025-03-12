import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const CreateReservation = () => {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { state } = location || {};

  const [restaurant, setRestaurant] = useState(null);
  const tableImage = "/img/table.png"; // Replace with your table image URL

  const [selectedTables, setSelectedTables] = useState([]); // Define selectedTables state
  const [availableTables, setAvailableTables] = useState([]);
  const [reservedTables, setReservedTables] = useState([]);
  const [formData, setFormData] = useState({
    restaurantId: state?.restaurantId || restaurantId,
    shopName: state?.name || "",
    tableNumber: "",
    customerName: "",
    customerEmail: "",
    NoofPerson: "",
    date: "",
    time: "",
  });

  // Time slots for selection
  const timeSlots = [
    "08:00 - 10:00 AM",
    "10:00 - 12:00 PM",
    "12:00 - 02:00 PM",
    "02:00 - 04:00 PM",
    "04:00 - 06:00 PM",
    "06:00 - 08:00 PM",
    "08:00 - 10:00 PM",
  ];

  // Fetch restaurant details if not provided
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ITPM/restaurants/get-restaurant/${restaurantId}`
        );
        setRestaurant(response.data);
        setFormData((prev) => ({
          ...prev,
          shopName: response.data.name,
        }));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch available tables when date & time are selected
  // Fetch available tables when date & time are selected
  useEffect(() => {
    const fetchAvailableTables = async () => {
      if (formData.date && formData.time) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/ITPM/reservations/available-tables`,
            {
              params: {
                restaurantId,
                date: formData.date,
                time: formData.time,
              },
            }
          );
          setAvailableTables(response.data.availableTables || []);
          setReservedTables(response.data.reservedTables || []); // ✅ Store reserved tables
        } catch (error) {
          console.error("Error fetching available tables:", error);
        }
      }
    };

    fetchAvailableTables();
  }, [formData.date, formData.time, restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTables.length === 0) {
      alert("Please select at least one table.");
      return;
    }

    const totalCapacity =
      selectedTables.length * (restaurant?.seatsPerTable || 0);
    if (totalCapacity < parseInt(formData.NoofPerson, 10)) {
      alert(
        `Not enough seats! Selected tables can only seat ${totalCapacity} people.`
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/reservations/create-reservation",
        { ...formData, tableNumber: selectedTables.join(", ") }
      );

      const reservationId = response.data.reservationId; // Extract reservationId from response
      // console.log("Backend Reservation ID:", reservationId); // ✅ Check this line

      // ✅ Redirect to another page with reservationId using state
      navigate(`/user/restaurent-details/${restaurantId}`, {
        state: { reservationId }, // ✅ Pass only reservationId (restaurantId is in the URL)
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };

  const handleGoBack = () => {
    navigate(`/user/restaurent-details/${restaurantId}`);
  };

  const totalCapacity =
    selectedTables.length * (restaurant?.seatsPerTable || 0);

  const handleTableSelect = (tableNumber) => {
    if (reservedTables.includes(tableNumber)) return; // ✅ Prevent selection of reserved tables

    setSelectedTables((prevTables) => {
      const updatedTables = prevTables.includes(tableNumber)
        ? prevTables.filter((t) => t !== tableNumber)
        : [...prevTables, tableNumber];

      setFormData((prev) => ({
        ...prev,
        tableNumber: updatedTables.join(", "),
      }));

      return updatedTables;
    });
  };

  // const totalCapacity =
  //   selectedTables.length * (restaurant?.seatsPerTable || 0);

  if (!restaurant)
    return (
      <p className="text-center text-gray-500">Loading restaurant details...</p>
    );

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Create Reservation for {restaurant.name}
      </h2>

      {/* Display Restaurant & Reservation Details */}
      <div className="bg-gray-100 p-4 rounded shadow-sm">
        <p className="text-lg">
          <strong>Restaurant Name:</strong> {restaurant.name}
        </p>
        <p className="text-lg">
          <strong>Location:</strong> {restaurant.location}
        </p>
        <p className="text-lg">
          <strong>Phone:</strong> {restaurant.phoneNumber}
        </p>
        <p className="text-lg">
          <strong>Number of Tables:</strong> {restaurant.numberOfTables}
        </p>
        <p className="text-lg">
          <strong>Seats Per Table:</strong> {restaurant.seatsPerTable}
        </p>
      </div>

      {/* Display Table Images with Numbering "001", "002", ... */}
      <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
        Select Tables
      </h3>
      <p className="text-md text-gray-600 mb-2">
        Selected Tables: {selectedTables.join(", ") || "None"}
      </p>
      <p className="text-md text-gray-600 mb-4">
        Total Seating Capacity: {totalCapacity} persons
      </p>

      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded">
        {[...Array(restaurant.numberOfTables)].map((_, index) => {
          const tableNumber = String(index + 1).padStart(3, "0");

          const isReserved = reservedTables.includes(tableNumber);
          const isSelected = selectedTables.includes(tableNumber);

          return (
            <div
              key={index}
              className={`relative text-center p-2 rounded transition ${
                isSelected
                  ? "bg-green-500 text-white" // ✅ Selected tables turn solid green
                  : isReserved
                  ? "bg-red-500 text-white" // 🔴 Reserved tables stay red
                  : "bg-green-500 hover:bg-green-700" // ✅ Available tables turn light green on hover
              } ${
                isReserved
                  ? "cursor-not-allowed pointer-events-none hover:bg-red-600" // 🔴 Reserved tables turn darker on hover
                  : "cursor-pointer"
              }`}
              onClick={() => !isReserved && handleTableSelect(tableNumber)} // ✅ Prevent click on reserved tables
            >
              <img
                src={tableImage}
                alt={`Table ${tableNumber}`}
                className="mx-auto w-12 h-12"
              />
              <p
                className={`text-sm ${
                  isSelected || isReserved ? "text-white" : "text-gray-700"
                }`}
              >
                Table {tableNumber}
              </p>

              {/* ✅ Show Checkmark When Selected */}
              {isSelected && (
                <span className="absolute top-1 right-1 bg-white text-green-500 rounded-full p-1">
                  ✅
                </span>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input type="text" value={formData.shopName} readOnly hidden />

        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Customer Email</label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Number of People</label>
          <input
            type="number"
            name="NoofPerson"
            value={formData.NoofPerson}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
          {parseInt(formData.NoofPerson || 0, 10) > totalCapacity && (
            <p className="text-red-500 text-sm mt-1">
              Not enough seats! Selected tables can only seat {totalCapacity}{" "}
              people.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Reservation Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Reservation Time</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="">Select Time Slot</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
        >
          Create Reservation
        </button>
      </form>

      <button
        onClick={handleGoBack}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600"
      >
        Back to Restaurant
      </button>
    </div>
  );
};

export default CreateReservation;
