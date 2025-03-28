import React, { useState } from "react";
import {
  Typography,
  Input,
  Button,
  Card,
  CardBody,
} from "@material-tailwind/react";
import axios from "axios";

const CardPaymentPage = () => {
  const [cardData, setCardData] = useState({
    amount: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const getNextTransactionId = () => {
    const lastId = parseInt(localStorage.getItem("lastTxnId") || "1000");
    const nextId = lastId + 1;
    localStorage.setItem("lastTxnId", nextId);
    return `TXN${nextId}`;
  };

  const handlePayment = async () => {
    if (!cardData.amount || isNaN(cardData.amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    const transactionId = getNextTransactionId();

    const paymentPayload = {
      userId: "66042ec4fb8b6f95b22f08c3",     // Replace with actual userId
      orderId: "66042ec4fb8b6f95b22f08c3",    // Replace with actual orderId
      amount: parseFloat(cardData.amount),
      paymentMethod: "Card",
      status: "Pending",
      transactionId,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/ITPM/payments", paymentPayload);
      setSuccessMsg(`Payment of Rs.${cardData.amount} Successful! Txn ID: ${transactionId}`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000); // Hide after 5 seconds
    } catch (error) {
      console.error("Payment failed:", error.response?.data || error.message);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-lg shadow-lg p-6 rounded-2xl border border-blue-gray-100">
        <CardBody>
          {/* Success Alert */}
          {showAlert && (
            <div className="mb-4 p-4 text-green-800 bg-green-100 rounded-lg border border-green-300 transition duration-300 ease-in-out">
              <strong className="block font-medium">Success!</strong>
              <span className="text-sm">{successMsg}</span>
            </div>
          )}

          <Typography variant="h4" className="text-center text-blue-gray-900 mb-6">
            Secure Card Payment
          </Typography>

          <div className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                Amount 
              </label>
              <Input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={cardData.amount}
                onChange={handleChange}
                required
                className="bg-white"
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                Card Number
              </label>
              <Input
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.cardNumber}
                onChange={handleChange}
                maxLength={19}
                required
                className="bg-white"
              />
            </div>

            {/* Expiry + CVV side by side */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                  Expiry Date
                </label>
                <Input
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChange={handleChange}
                  maxLength={5}
                  required
                  className="bg-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                  CVV
                </label>
                <Input
                  name="cvv"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={handleChange}
                  maxLength={4}
                  required
                  className="bg-white"
                />
              </div>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              className="mt-4 bg-blue-gray-900 text-white w-full text-md"
              size="lg"
            >
              Pay Rs.{cardData.amount || "0.00"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CardPaymentPage;
