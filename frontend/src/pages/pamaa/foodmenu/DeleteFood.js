import axios from "axios";

// Function to delete a food item by ID
const deleteFood = async (id, setFoods, foods) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/ITPM/food-items/delete-food/${id}`
    );
    setFoods(foods.filter((food) => food._id !== id)); // Remove the deleted food item from the list
    console.log("Food item deleted");
  } catch (error) {
    console.error("Error deleting food item", error);
  }
};

export default deleteFood;
