import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    orderId: "",
    amount: "",
    paymentMethod: "Card",
    status: "Pending",
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/ITPM/payments/${id}`)
      .then((res) => setPayment(res.data))
      .catch((err) => console.error("Error fetching payment", err));
  }, [id]);

  const handleChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/ITPM/payments/${id}`, payment);
      alert("Payment Updated Successfully!");
      navigate("/admin/payments");
    } catch (error) {
      console.error("Error updating payment", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Update Payment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="orderId" value={payment.orderId} onChange={handleChange} className="border p-2 w-full mb-2"/>
        <input type="number" name="amount" value={payment.amount} onChange={handleChange} className="border p-2 w-full mb-2"/>
        <select name="status" value={payment.status} onChange={handleChange} className="border p-2 w-full mb-2">
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Update</button>
      </form>
    </div>
  );
};

export default UpdatePayment;
