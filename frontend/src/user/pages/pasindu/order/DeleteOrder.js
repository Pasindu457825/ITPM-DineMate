import axios from "axios";

const deleteOrder = async (orderId, navigate) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/ITPM/orders/delete-order/${orderId}` // Send `orderId`, not `_id`
    );

    if (response.status === 200) {
      console.log("Order deleted successfully");
      alert("Order has been deleted successfully.");
      navigate(-1); // Navigate back after deletion
    } else {
      console.error("Failed to delete order");
    }
  } catch (error) {
    console.error("Error deleting order", error);
    alert("Error deleting order. Please try again.");
  }
};


export default deleteOrder;
