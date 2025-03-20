import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DeletePayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/ITPM/payments/${id}`);
      alert("Payment Deleted Successfully!");
      navigate("/manager/payments");
    } catch (error) {
      console.error("Error deleting payment", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
      <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded w-full">
        Delete Payment
      </button>
    </div>
  );
};

export default DeletePayment;
