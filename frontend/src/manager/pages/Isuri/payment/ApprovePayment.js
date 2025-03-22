import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ApprovePayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState({ status: "Pending" });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/ITPM/payments/${id}`)
      .then((res) => setPayment(res.data))
      .catch((err) => console.error("Error fetching payment", err));
  }, [id]);

  const handleApproval = async (status) => {
    try {
      await axios.put(`http://localhost:5000/api/ITPM/payments/${id}`, { status });
      alert(`Payment marked as ${status}`);
      navigate("/manager/payments");
    } catch (error) {
      console.error("Error updating payment", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-4">Approve Payment</h2>
      <button
        onClick={() => handleApproval("Completed")}
        className="bg-green-500 text-white p-2 rounded w-full mb-2"
      >
        Approve Payment
      </button>
      <button
        onClick={() => handleApproval("Failed")}
        className="bg-red-500 text-white p-2 rounded w-full"
      >
        Reject Payment
      </button>
    </div>
  );
};

export default ApprovePayment;
