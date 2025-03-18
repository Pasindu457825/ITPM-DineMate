import { useState, useEffect } from "react";
import axios from "axios";

const UserPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("/api/payments");
      setPayments(res.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">My Payments</h2>
      <ul>
        {payments.map((p) => (
          <li key={p._id} className="border p-2 my-2">
            {p.amount} - {p.paymentMethod} - {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPayments;
