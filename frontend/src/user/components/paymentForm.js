import React from "react";

const PaymentForm = ({ payment, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <input type="text" name="orderId" placeholder="Order ID" value={payment.orderId} onChange={handleChange} className="border p-2 w-full mb-2"/>
      <input type="number" name="amount" placeholder="Amount" value={payment.amount} onChange={handleChange} className="border p-2 w-full mb-2"/>
      <select name="paymentMethod" value={payment.paymentMethod} onChange={handleChange} className="border p-2 w-full mb-2">
        <option value="Card">Card</option>
        <option value="Cash">Cash</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Submit Payment</button>
    </form>
  );
};

export default PaymentForm;