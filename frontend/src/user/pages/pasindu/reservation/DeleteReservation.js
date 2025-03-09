import axios from "axios";

// Function to delete a reservation by ID
const deleteReservation = async (id, setReservations, reservations) => {
  try {
    await axios.delete(`http://localhost:5000/api/ITPM/reservations/delete-reservation/${id}`);
    setReservations(reservations.filter((reservation) => reservation._id !== id)); // Remove the deleted reservation from the list
    console.log("Reservation deleted");
  } catch (error) {
    console.error("Error deleting reservation", error);
  }
};

export default deleteReservation;
