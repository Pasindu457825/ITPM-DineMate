import axios from "axios";

// Function to delete a restaurant by ID
const deleteRestaurant = async (id, setRestaurants, restaurants) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/ITPM/restaurants/delete-restaurant/${id}`
    );
    setRestaurants(restaurants.filter((restaurant) => restaurant._id !== id)); // Remove the deleted restaurant from the list
    console.log("Restaurant deleted");
  } catch (error) {
    console.error("Error deleting restaurant", error);
  }
};

export default deleteRestaurant;
