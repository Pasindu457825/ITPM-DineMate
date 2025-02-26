const express = require('express');
const router = express.Router();
const reservationController = require('../../controllers/pasindu/reservationController');

// Create a new reservation
router.post('/create-reservation', reservationController.addReservation);

// Get all reservations
router.get('/get-all-reservations', reservationController.getAllReservations);

// Get a single reservation by ID
router.get('/get-reservation/:id', reservationController.getReservationById);

// Update a reservation by ID
router.put('/update-reservation/:id', reservationController.updateReservation);

// Delete a reservation by ID
router.delete('/delete-reservation/:id', reservationController.deleteReservation);

module.exports = router;
