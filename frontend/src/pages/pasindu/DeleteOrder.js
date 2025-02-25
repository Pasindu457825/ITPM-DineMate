import axios from "axios";

// Function to delete an order by ID
const deleteOrder = async (id, setOrders, orders) => {
  try {
    await axios.delete(`http://localhost:5000/api/ITPM/orders/delete-order/${id}`);
    setOrders(orders.filter((order) => order._id !== id)); // Remove the deleted order from the list
    console.log("Order deleted");
  } catch (error) {
    console.error("Error deleting order", error);
  }
};

export default deleteOrder;
