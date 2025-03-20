import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPayment } from "../../../../services/paymentServices"; // Ensure correct path

const CreatePayment = () => {
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    userId: "", // Fetch from logged-in user
    orderId: "",
    amount: "",
    paymentMethod: "Card",
  });

  const handleChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayment(payment);
      alert("Payment Created Successfully!");
      navigate("/user/payments");
    } catch (error) {
      console.error("Error creating payment", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create Payment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="orderId"
          placeholder="Order ID"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default CreatePayment;
