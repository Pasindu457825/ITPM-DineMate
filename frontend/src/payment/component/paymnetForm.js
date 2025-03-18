import { useState } from "react";
import axios from "axios";

const PaymentForm = ({ existingPayment, onSuccess }) => {
  const [payment, setPayment] = useState(
    existingPayment || {
      amount: "",
      paymentMethod: "Card",
      status: "Pending",
    }
  );

  const handleChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingPayment) {
        await axios.put(`/api/payments/${existingPayment._id}`, payment);
      } else {
        await axios.post("/api/payments", payment);
      }
      onSuccess();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg">
      <input
        type="text"
        name="amount"
        value={payment.amount}
        onChange={handleChange}
        placeholder="Amount"
        className="border p-2 rounded w-full mb-2"
        required
      />
      <select
        name="paymentMethod"
        value={payment.paymentMethod}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="Card">Card</option>
        <option value="Cash">Cash</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {existingPayment ? "Update" : "Create"} Payment
      </button>
    </form>
  );
};

export default PaymentForm;
