import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { RotateCw, CalendarCheck } from "lucide-react"; // Ensure these icons are imported

const CreateReservation = () => {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { state } = location || {};
  const [authError, setAuthError] = useState(false);

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
    const { name, value } = e.target;

    if (name === "date") {
      const today = new Date().toISOString().split("T")[0];
      if (value !== today) {
        setFormData((prev) => ({ ...prev, time: "" })); // Reset time if date changes
      }
    }

    setFormData({ ...formData, [name]: value });
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
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found.");
          setAuthError(true); // 👈 show message instead of immediate redirect
          return;
        }

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
        setAuthError(true); // 👈 set auth error if fetching fails
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

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center border border-gray-200">
          <div className="mb-4 text-yellow-500 text-5xl">⚠️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            You must be logged in to create a reservation.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-amber-700 hover:bg-amber-600 text-black font-semibold py-2 px-6 rounded-md shadow-md transition duration-200 w-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

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

  const isTimeSlotPast = (slot) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Extract the start time from the time slot
    const [startTime, endTime] = slot.split(" - ");
    let [startHour, startMinutes] = startTime.split(":").map(Number);
    const isPM = slot.includes("PM") && !slot.includes("12:");

    // Convert 12-hour format to 24-hour format
    if (isPM) startHour += 12;
    if (slot.includes("AM") && startHour === 12) startHour = 0;

    // Compare the time slot with the current system time
    if (startHour < currentHour) return true;
    if (startHour === currentHour && startMinutes <= currentMinutes)
      return true;

    return false;
  };

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

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center">
        <p className="text-xl text-gray-700 font-medium">
          Loading restaurant details...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/5 bg-white shadow-2xl rounded-2xl p-6 flex flex-col items-start self-start">
          <h2 className="text-4xl font-semibold text-gray-800 mb-4">
            {restaurant.name}
          </h2>

          {/* Display Restaurant & Reservation Details */}
          <div className="">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-64 object-cover rounded-xl shadow-lg my-4"
            />
            <p className="text-lg text-gray-700 font-medium flex items-start">
              <span className="text-pink-600 text-xl mr-2">📍</span>
              <strong>Location:</strong>{" "}
              <span className="ml-1 flex-1">{restaurant.location}</span>
            </p>
            <p className="text-lg text-gray-700 font-medium flex items-start">
              <span className="text-pink-600 text-xl mr-2">☎️</span>
              <strong>Phone:</strong>{" "}
              <span className="ml-1 flex-1">{restaurant.phoneNumber}</span>
            </p>
          </div>

          <button
            onClick={handleGoBack}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600"
          >
            Back to Restaurant
          </button>
        </div>
        <div className="md:w-5/6 bg-white shadow-2xl rounded-2xl p-6 flex flex-col relative min-h-screen">
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input type="text" value={formData.shopName} readOnly hidden />
            <h2
              className="text-5xl font-bold text-gray-800 mb-6"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Book A Table
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Side */}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    readOnly
                    className="p-2 border border-gray-300 rounded w-full bg-gray-100 cursor-not-allowed pointer-events-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]} // Prevent past dates
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Reservation Time
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="p-2 border border-gray-300 rounded w-full"
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map((slot, index) => {
                      const shouldDisable =
                        formData.date ===
                          new Date().toISOString().split("T")[0] &&
                        isTimeSlotPast(slot);

                      return (
                        <option
                          key={index}
                          value={slot}
                          disabled={shouldDisable}
                        >
                          {slot} {shouldDisable ? "(Unavailable)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Number of People
                  </label>
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
                      Not enough seats! Selected tables can only seat{" "}
                      {totalCapacity} people.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Customer Email
                  </label>
                  <input
                    type="text"
                    name="customerEmail"
                    value={formData.customerEmail}
                    readOnly
                    className="p-2 border border-gray-300 rounded w-full bg-gray-100 cursor-not-allowed pointer-events-none"
                  />
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
                        setFormData({
                          ...formData,
                          specialRequests: e.target.value,
                        });
                      }
                    }}
                    className="p-2 border border-gray-300 rounded w-full"
                    placeholder="Any special requests (e.g., birthday setup, window seat)..."
                    maxLength="200"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    {200 - formData.specialRequests.length} characters remaining
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 mb-2">
              <button
                onClick={() =>
                  navigate(`/restaurant/${restaurant._id}/virtual-tour`)
                }
                className="flex items-center gap-2 bg-blue-gray-800 font-sans font-bold text-white px-6 py-3 rounded-md hover:bg-blue-gray-500 w-fit"
              >
                <RotateCw className="w-5 h-5" />
                View Tables 360°
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 bg-green-500 font-sans font-bold text-white px-6 py-3 rounded-md hover:bg-green-800 w-fit"
              >
                <CalendarCheck className="w-5 h-5" />
                Book Now
              </button>
            </div>
          </form>
          {/* Display Table Images with Numbering "001", "002", ... */}
          {/* Table Selection Section */}
          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
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

          {/* ✅ Wrap all grouped tables in a column layout */}
          <div className="grid grid-cols-3 gap-6">
            {Object.entries(groupedTables).map(([seats, tables]) => (
              <div key={seats} className="bg-gray-50 py-3 pr-6 rounded shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Tables with {seats} Seats
                </h3>
                {/* Adjust grid for tables inside each section */}
                <div className="grid grid-cols-3 gap-4">
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
                            : "bg-amber-500 hover:bg-amber-700"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReservation;
