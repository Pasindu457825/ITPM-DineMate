import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PaymentDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/ITPM/payments/${id}`)
      .then((res) => setPayment(res.data))
      .catch((err) => console.error("Error fetching payment", err));
  }, [id]);

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
      {payment && (
        <div>
          <p><strong>Order ID:</strong> {payment.orderId}</p>
          <p><strong>Amount:</strong> ${payment.amount}</p>
          <p><strong>Payment Method:</strong> {payment.paymentMethod}</p>
          <p><strong>Status:</strong> {payment.status}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;