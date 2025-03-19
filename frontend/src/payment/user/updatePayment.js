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
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/ITPM/payments/${id}`)
      .then((res) => {
        // Prevent users from updating a completed or failed payment
        if (res.data.status !== "Pending") {
          alert("You cannot update a completed or failed payment.");
          navigate("/user/payments");
        } else {
          setPayment({
            orderId: res.data.orderId,
            amount: res.data.amount,
            paymentMethod: res.data.paymentMethod,
          });
        }
      })
      .catch((err) => console.error("Error fetching payment", err));
  }, [id, navigate]);

  const handleChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/ITPM/payments/${id}`, payment);
      alert("Payment Updated Successfully!");
      navigate("/user/payments"); // Redirect to user payments page
    } catch (error) {
      console.error("Error updating payment", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Update Payment</h2>
      <form onSubmit={handleSubmit}>
        <p className="text-gray-600 mb-2">Order ID: {payment.orderId}</p>
        <input type="number" name="amount" value={payment.amount} onChange={handleChange} className="border p-2 w-full mb-2" required />
        <select name="paymentMethod" value={payment.paymentMethod} onChange={handleChange} className="border p-2 w-full mb-2" required>
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Update Payment</button>
      </form>
    </div>
  );
};

export default UpdatePayment;
