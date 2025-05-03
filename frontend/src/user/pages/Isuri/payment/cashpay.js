import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Input,
  Button,
  Card,
  CardBody,
} from "@material-tailwind/react";
import axios from "axios";

const CashPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, orderId, total, customerEmail } = location.state || {};
  const [amount, setAmount] = useState(total || "");
  const [successMsg, setSuccessMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    if (!userId || !orderId || !total ) {
      alert("Missing payment details. Redirecting...");
      navigate("/");
    }
  }, [userId, orderId, total, customerEmail, navigate]);

  const getNextTransactionId = () => {
    const lastId = parseInt(localStorage.getItem("lastTxnId") || "1000");
    const nextId = lastId + 1;
    localStorage.setItem("lastTxnId", nextId);
    return `TXN${nextId}`;
  };

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const transactionId = getNextTransactionId();

    const paymentPayload = {
      userId,
      orderId,
      amount: parseFloat(amount),
      paymentMethod: "Cash",
      status: "Pending",
      transactionId,
    };

    try {
      await axios.post("http://localhost:5000/api/ITPM/payments", paymentPayload);
      setSuccessMsg(`Cash payment of Rs.${amount} requested. Txn ID: ${transactionId}`);
      setShowAlert(true);

      setTimeout(() => {
        navigate(`/my-orders/${customerEmail}`);
      }, 1500);
    } catch (error) {
      console.error("Payment failed:", error.response?.data || error.message);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg p-6 rounded-2xl border border-blue-gray-100">
        <CardBody>
          {showAlert && (
            <div className="mb-4 p-4 text-green-800 bg-green-100 rounded-lg border border-green-300 transition duration-300 ease-in-out">
              <strong className="block font-medium">Success!</strong>
              <span className="text-sm">{successMsg}</span>
            </div>
          )}

          <Typography variant="h4" className="text-center text-blue-gray-900 mb-6">
            Cash Payment
          </Typography>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">
                Amount
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="bg-white"
              />
            </div>

            <Button
              onClick={handlePayment}
              className="mt-4 bg-blue-gray-900 text-white w-full text-md"
              size="lg"
            >
              Pay Rs.{amount || "0.00"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CashPaymentPage;
