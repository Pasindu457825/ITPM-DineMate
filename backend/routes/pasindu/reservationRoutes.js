// const express = require('express');
// const router = express.Router();
// const Reservation = require('../models/Reservation');

// // 1. Create a new reservation
// router.post('/reserve', async (req, res) => {
//   const { reservationId, shopName, tableNumber, customerName, customerEmail, NoofPerson, date, time } = req.body;

//   try {
//     const newReservation = new Reservation({
//       reservationId,
//       shopName,
//       tableNumber,
//       customerName,
//       customerEmail,
//       NoofPerson,
//       date,
//       time,
//     });

//     await newReservation.save();
//     res.status(201).json({ message: 'Reservation created successfully!', reservation: newReservation });
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating reservation', error });
//   }
// });

// // 2. Get a reservation by ID
// router.get('/reserve/:reservationId', async (req, res) => {
//   try {
//     const reservation = await Reservation.findOne({ reservationId: req.params.reservationId });

//     if (!reservation) {
//       return res.status(404).json({ message: 'Reservation not found!' });
//     }

//     res.status(200).json(reservation);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching reservation', error });
//   }
// });

// // 3. Get all reservations for a specific shop
// router.get('/reserve/shop/:shopName', async (req, res) => {
//   try {
//     const reservations = await Reservation.find({ shopName: req.params.shopName });

//     if (reservations.length === 0) {
//       return res.status(404).json({ message: 'No reservations found for this shop!' });
//     }

//     res.status(200).json(reservations);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching reservations', error });
//   }
// });

// // 4. Update a reservation (e.g., changing the table, date, or time)
// router.put('/reserve/:reservationId', async (req, res) => {
//   const { tableNumber, date, time } = req.body;

//   try {
//     const updatedReservation = await Reservation.findOneAndUpdate(
//       { reservationId: req.params.reservationId },
//       { tableNumber, date, time },
//       { new: true } // To return the updated document
//     );

//     if (!updatedReservation) {
//       return res.status(404).json({ message: 'Reservation not found!' });
//     }

//     res.status(200).json({ message: 'Reservation updated successfully!', reservation: updatedReservation });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating reservation', error });
//   }
// });

// // 5. Delete a reservation
// router.delete('/reserve/:reservationId', async (req, res) => {
//   try {
//     const deletedReservation = await Reservation.findOneAndDelete({ reservationId: req.params.reservationId });

//     if (!deletedReservation) {
//       return res.status(404).json({ message: 'Reservation not found!' });
//     }

//     res.status(200).json({ message: 'Reservation deleted successfully!', reservation: deletedReservation });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting reservation', error });
//   }
// });

// module.exports = router;
