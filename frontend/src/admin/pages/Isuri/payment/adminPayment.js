import { useState, useEffect } from "react";
import axios from "axios";

const AdminPayments = () => {
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

  const deletePayment = async (id) => {
    if (window.confirm("Are you sure?")) {
      await axios.delete(`/api/payments/${id}`);
      fetchPayments();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">All Payments</h2>
      <ul>
        {payments.map((p) => (
          <li key={p._id} className="border p-2 my-2">
            {p.amount} - {p.paymentMethod} - {p.status}
            <button onClick={() => deletePayment(p._id)} className="bg-red-500 text-white px-2 ml-4 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPayments;
