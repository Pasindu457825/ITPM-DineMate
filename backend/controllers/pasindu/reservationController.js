// controllers/reservationController.js
const Reservation = require('../../models/pasindu/reservationModel'); // Assuming the path is correct

// Add new reservation
const addReservation = async (req, res) => {
    const {shopName, tableNumber, customerName, customerEmail, NoofPerson, date, time } = req.body;

    if (!customerName || !customerEmail || !shopName || !tableNumber || !NoofPerson || !date || !time) {
        return res.status(400).json({ message: 'Required fields are missing' }); // Ensure all required fields are sent
    }

    try {
        const newReservation = new Reservation({
            // reservationId,
            shopName,
            tableNumber,
            customerName,
            customerEmail,
            NoofPerson,
            date,
            time,
        });
        await newReservation.save();
        res.status(201).json({ message: 'Reservation added successfully', reservation: newReservation });
    } catch (error) {
        console.error('Error in adding reservation:', error);  // Detailed logging
        res.status(500).json({ message: 'Error adding reservation', error: error.message });
    }
};

// Get one reservation by ID
const getReservationById = async (req, res) => {
    const { id } = req.params;
    try {
        const reservation = await Reservation.findById(id); // Using Mongoose's findById method
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.json(reservation); // Return the reservation data as JSON
    } catch (error) {
        console.error("Error fetching reservation:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all reservations
const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update reservation
const updateReservation = async (req, res) => {
    const { id } = req.params;
    const { reservationId, shopName, tableNumber, customerName, customerEmail, NoofPerson, date, time } = req.body;

    try {
        // Find the reservation by its ID and update it
        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            {
                reservationId,
                shopName,
                tableNumber,
                customerName,
                customerEmail,
                NoofPerson,
                date,
                time,
            }, // Fields to update
            { new: true } // Returns the updated document
        );

        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json(updatedReservation); // Return the updated reservation
    } catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete reservation
const deleteReservation = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find and delete the reservation by its ID
      const deletedReservation = await Reservation.findByIdAndDelete(id);
  
      if (!deletedReservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      res.status(200).json({ message: 'Reservation deleted successfully', reservation: deletedReservation });
    } catch (error) {
      console.error('Error deleting reservation:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
    addReservation,
    getReservationById,
    getAllReservations,
    updateReservation,
    deleteReservation,
};
