import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const DeletePayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/ITPM/payments/${id}`);
      alert("Payment Deleted Successfully!");
      navigate("/admin/payments");
    } catch (error) {
      console.error("Error deleting payment", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
      <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded w-full">Delete Payment</button>
    </div>
  );
};

export default DeletePayment;
