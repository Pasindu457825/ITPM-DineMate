import axios from "axios";

// Function to delete an item by ID
const deleteItem = async (id, setItems, items) => {
  try {
    await axios.delete(`http://localhost:5000/api/ITPM/items/delete-item/${id}`);
    setItems(items.filter((item) => item._id !== id)); // Remove the deleted item from the list
    console.log("Item deleted");
  } catch (error) {
    console.error("Error deleting item", error);
  }
};

export default deleteItem;
