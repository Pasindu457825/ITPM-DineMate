import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdatePayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    amount: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/ITPM/payments/${id}`)
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
      navigate("/user/payments");
    } catch (error) {
      console.error("Error updating payment", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Update Payment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="amount"
          value={payment.amount}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          placeholder="Enter Amount"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Update Payment
        </button>
      </form>
    </div>
  );
};

export default UpdatePayment;
