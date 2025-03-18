import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/ITPM/payments")
      .then((res) => setPayments(res.data))
      .catch((err) => console.error("Error fetching payments", err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">All Payments</h2>
      {payments.map((payment) => (
        <div key={payment._id} className="border p-4 mb-2 rounded">
          <p>User ID: {payment.userId}</p>
          <p>Amount: ${payment.amount}</p>
          <p>Status: {payment.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ManagerPayments;
