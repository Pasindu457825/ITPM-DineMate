import React, { useEffect, useState } from "react";
import { getManagerPayments, approvePayment } from "../../../../services/paymentServices";

const ManagerPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const data = await getManagerPayments();
      setPayments(data);
    };
    fetchPayments();
  }, []);

  const handleApprove = async (id, status) => {
    await approvePayment(id, status);
    alert("Payment Updated!");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Payments</h2>
      {payments.map((payment) => (
        <div key={payment._id} className="p-4 border mb-2 rounded-lg">
          <p><strong>Amount:</strong> ${payment.amount}</p>
          <p><strong>Status:</strong> {payment.status}</p>
          {payment.status === "Pending" && (
            <div className="mt-2">
              <button onClick={() => handleApprove(payment._id, "Completed")} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
              <button onClick={() => handleApprove(payment._id, "Failed")} className="bg-red-500 text-white px-3 py-1 rounded ml-2">Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManagerPayments;
