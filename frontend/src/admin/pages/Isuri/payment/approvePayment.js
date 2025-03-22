import React, { useState, useEffect } from "react";
import axios from "axios";

const ApprovePayment = ({ id }) => {
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/ITPM/payments/${id}`)
      .then((res) => setPayment(res.data))
      .catch((err) => console.error("Error fetching payment", err));
  }, [id]);

  const handleApproval = async (status) => {
    try {
      await axios.put(`http://localhost:5000/api/ITPM/payments/${id}`, { status });
      alert(`Payment ${status}`);
    } catch (error) {
      console.error("Error updating payment status", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Approve Payment</h2>
      {payment && (
        <div>
          <p>Amount: ${payment.amount}</p>
          <p>Status: {payment.status}</p>
          <button onClick={() => handleApproval("Completed")} className="bg-green-500 text-white p-2 rounded w-full">Approve</button>
          <button onClick={() => handleApproval("Failed")} className="bg-red-500 text-white p-2 rounded w-full mt-2">Reject</button>
        </div>
      )}
    </div>
  );
};

export default ApprovePayment;
