const Reservation = require("../../models/pasindu/reservationModel");
const Restaurant = require("../../models/pamaa/restaurantModel"); // Assuming the path is correct

// Add new reservation
const addReservation = async (req, res) => {
  const {
    restaurantId,
    shopName,
    tableNumber,
    customerName,
    customerEmail,
    NoofPerson,
    date,
    time,
  } = req.body;

  if (
    !restaurantId ||
    !customerName ||
    !customerEmail ||
    !shopName ||
    !tableNumber ||
    !NoofPerson ||
    !date ||
    !time
  ) {
    return res.status(400).json({ message: "Required fields are missing" }); // Ensure all required fields are sent
  }

  try {
    const newReservation = new Reservation({
      restaurantId, // ✅ Now storing restaurantId
      shopName,
      tableNumber,
      customerName,
      customerEmail,
      NoofPerson,
      date,
      time,
    });

    await newReservation.save();

    res.status(201).json({
      message: "Reservation added successfully",
      reservationId: newReservation._id, // ✅ Send reservationId explicitly
    });
    
  } catch (error) {
    console.error("Error in adding reservation:", error);
    res
      .status(500)
      .json({ message: "Error adding reservation", error: error.message });
  }
};

// Get one reservation by ID
const getReservationById = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findById(id).populate(
      "restaurantId",
      "name location"
    ); // ✅ Populate restaurant details
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all reservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate(
      "restaurantId",
      "name location"
    ); // ✅ Populate restaurant details
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reservations by Restaurant ID
const getReservationsByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const reservations = await Reservation.find({ restaurantId });
    if (reservations.length === 0) {
      return res
        .status(404)
        .json({ message: "No reservations found for this restaurant." });
    }
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update reservation
const updateReservation = async (req, res) => {
  const { id } = req.params;
  const {
    restaurantId,
    shopName,
    tableNumber,
    customerName,
    customerEmail,
    NoofPerson,
    date,
    time,
  } = req.body;

  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      {
        restaurantId, // ✅ Include restaurantId in update
        shopName,
        tableNumber,
        customerName,
        customerEmail,
        NoofPerson,
        date,
        time,
      },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete reservation
const deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.status(200).json({
      message: "Reservation deleted successfully",
      reservation: deletedReservation,
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAvailableTables = async (req, res) => {
  const { restaurantId, date, time } = req.query;

  if (!restaurantId || !date || !time) {
    return res
      .status(400)
      .json({ message: "Restaurant ID, date, and time are required." });
  }

  try {
    // ✅ Fetch restaurant details (to get total tables)
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    // ✅ Fetch all reservations for this restaurant on the given date & time
    const reservations = await Reservation.find({ restaurantId, date, time });

    // ✅ Extract reserved table numbers
    const reservedTableNumbers = reservations.flatMap((reservation) =>
      reservation.tableNumber.split(", ").map((table) => table.trim())
    );

    // ✅ Generate all table numbers (assuming tables are sequentially numbered)
    const allTables = Array.from(
      { length: restaurant.numberOfTables },
      (_, i) => String(i + 1).padStart(3, "0") // Format as "001", "002", etc.
    );

    // ✅ Filter out reserved tables to get available tables
    const availableTables = allTables.filter(
      (table) => !reservedTableNumbers.includes(table)
    );

    res
      .status(200)
      .json({ availableTables, reservedTables: reservedTableNumbers });
  } catch (error) {
    console.error("Error fetching available tables:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addReservation,
  getReservationById,
  getAllReservations,
  getReservationsByRestaurant, // ✅ Added new function
  updateReservation,
  deleteReservation,
  getAvailableTables,
};
