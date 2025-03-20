import React, { useEffect, useState } from "react";
import { getUserPayments } from "../../../../services/paymentServices";

const UserPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const data = await getUserPayments("userIdFromAuth");
      setPayments(data);
    };
    fetchPayments();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">My Payments</h2>
      {payments.map((payment) => (
        <div key={payment._id} className="p-4 border mb-2 rounded-lg">
          <p><strong>Amount:</strong> ${payment.amount}</p>
          <p><strong>Status:</strong> {payment.status}</p>
        </div>
      ))}
    </div>
  );
};

export default UserPayments;
