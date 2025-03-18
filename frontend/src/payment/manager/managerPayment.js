import { useState, useEffect } from "react";
import axios from "axios";

const ManagerPayments = () => {
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

  const updateStatus = async (id, status) => {
    await axios.put(`/api/payments/${id}`, { status });
    fetchPayments();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Pending Payments</h2>
      <ul>
        {payments
          .filter((p) => p.status === "Pending")
          .map((p) => (
            <li key={p._id} className="border p-2 my-2">
              {p.amount} - {p.paymentMethod}
              <button onClick={() => updateStatus(p._id, "Completed")} className="bg-green-500 text-white px-2 ml-4 rounded">
                Approve
              </button>
              <button onClick={() => updateStatus(p._id, "Failed")} className="bg-red-500 text-white px-2 ml-4 rounded">
                Reject
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ManagerPayments;
