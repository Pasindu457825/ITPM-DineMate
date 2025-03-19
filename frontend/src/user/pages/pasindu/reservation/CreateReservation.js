import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const CreateReservation = () => {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { state } = location || {};

  const [restaurant, setRestaurant] = useState(null);
  const tableImage = "/img/table.png"; // Replace with your table image URL

  const [selectedTables, setSelectedTables] = useState([]); // {number, seats}
  const [availableTables, setAvailableTables] = useState([]);
  const [reservedTables, setReservedTables] = useState([]);
  const [formData, setFormData] = useState({
    restaurantId: state?.restaurantId || restaurantId,
    shopName: state?.name || "",
    tableNumber: "",
    customerName: state?.fname || "", // Prefill first name
    customerEmail: state?.email || "", // Prefill email
    NoofPerson: "",
    specialRequests: "",
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          console.log("No token found. User might not be logged in.");
          return;
        }

        // Send token in Authorization header
        const res = await axios.get("http://localhost:5000/api/ITPM/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error.response?.data || error.message
        );
      }
    };

    fetchProfile();
  }, []);

  // Update formData when user is fetched
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: `${state?.fname || user.fname} ${
          state?.lname || user.lname
        }`.trim(),
        customerEmail: state?.email || user.email,
      }));
    }
  }, [user, state]);

  if (!user) {
    return <div>Loading or not logged in...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTables.length === 0) {
      alert("Please select at least one table.");
      return;
    }

    const totalCapacity = selectedTables.reduce(
      (acc, table) => acc + table.seats,
      0
    );

    if (totalCapacity < parseInt(formData.NoofPerson, 10)) {
      alert(
        `Not enough seats! Selected tables can only seat ${totalCapacity} people.`
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/reservations/create-reservation",
        {
          ...formData,
          tableNumber: selectedTables.map((t) => t.number).join(", "), // ✅ Ensure only table numbers are sent
        }
      );

      const reservationId = response.data.reservationId;

      navigate(`/user/restaurent-details/${restaurantId}`, {
        state: { reservationId },
      });
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };

  const handleGoBack = () => {
    navigate(`/user/restaurent-details/${restaurantId}`);
  };

  const totalCapacity = selectedTables.reduce(
    (acc, table) => acc + table.seats,
    0
  );

  const handleTableSelect = (tableNumber, seats) => {
    if (reservedTables.includes(tableNumber)) return;

    setSelectedTables((prevTables) => {
      const alreadySelected = prevTables.some((t) => t.number === tableNumber);
      let updatedTables;

      if (alreadySelected) {
        updatedTables = prevTables.filter((t) => t.number !== tableNumber);
      } else {
        updatedTables = [...prevTables, { number: tableNumber, seats }];
      }

      setFormData((prev) => ({
        ...prev,
        tableNumber: updatedTables.map((t) => t.number).join(", "),
      }));

      return updatedTables;
    });
  };

  const groupedTables = restaurant?.tables?.reduce(
    (acc, tableType, tableTypeIndex) => {
      if (!acc[tableType.seats]) acc[tableType.seats] = [];

      for (let i = 0; i < tableType.quantity; i++) {
        const tableNumber = String(tableTypeIndex * 100 + i + 1).padStart(
          3,
          "0"
        );
        acc[tableType.seats].push(tableNumber);
      }
      return acc;
    },
    {}
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
      </div>

      {/* Display Table Images with Numbering "001", "002", ... */}
      <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
        Select Tables
      </h3>
      <p className="text-md text-gray-600 mb-2">
        Selected Tables:{" "}
        {selectedTables.length > 0
          ? selectedTables.map((t) => t.number).join(", ")
          : "None"}
      </p>

      <p className="text-md text-gray-600 mb-4">
        Total Seating Capacity: {totalCapacity} persons
      </p>

      {/* ✅ Convert Object to Array Before Mapping */}
      {Object.entries(groupedTables).map(([seats, tables]) => (
        <div key={seats} className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Tables with {seats} Seats
          </h3>
          <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded">
            {tables.map((tableNumber) => {
              const isReserved = reservedTables.includes(tableNumber);
              const isSelected = selectedTables.some(
                (t) => t.number === tableNumber
              );

              return (
                <div
                  key={tableNumber}
                  className={`relative text-center p-2 rounded transition ${
                    isSelected
                      ? "bg-green-500 text-white"
                      : isReserved
                      ? "bg-red-500 text-white"
                      : "bg-green-300 hover:bg-green-500"
                  } cursor-pointer`}
                  onClick={() =>
                    !isReserved &&
                    handleTableSelect(tableNumber, parseInt(seats))
                  }
                >
                  <img
                    src={tableImage}
                    alt={`Table ${tableNumber}`}
                    className="mx-auto w-12 h-12"
                  />
                  <p className="text-sm">{`Table ${tableNumber}`}</p>

                  {isSelected && (
                    <span className="absolute top-1 right-1 bg-white text-green-500 rounded-full p-1">
                      ✅
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input type="text" value={formData.shopName} readOnly hidden />

        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            readOnly // 🔒 Prevents user from editing
            className="p-2 border border-gray-300 rounded w-full bg-gray-100 cursor-not-allowed pointer-events-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerEmail}
            readOnly // 🔒 Prevents user from editing
            className="p-2 border border-gray-300 rounded w-full bg-gray-100 cursor-not-allowed pointer-events-none"
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

        <div>
          <label className="block text-sm font-medium">
            Special Requests (Optional)
          </label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => {
              if (e.target.value.length <= 200) {
                // ✅ Prevent input over 200 chars
                setFormData({ ...formData, specialRequests: e.target.value });
              }
            }}
            className="p-2 border border-gray-300 rounded w-full"
            placeholder="Any special requests (e.g., birthday setup, window seat)..."
            maxLength="200" // ✅ Prevent input over 200 chars (double safety)
          />
          <p className="text-gray-500 text-sm mt-1">
            {200 - formData.specialRequests.length} characters remaining
          </p>
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
