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

const CardPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, orderId, total, customerEmail } = location.state || {};

  const [cardData, setCardData] = useState({
    amount: total || "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!userId || !orderId || !total ) {
      alert("Missing payment details. Redirecting...");
      navigate("/");
    }
  }, [userId, orderId, total, customerEmail, navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case "amount":
        if (!value || isNaN(value) || parseFloat(value) <= 0) {
          return "Enter a valid amount.";
        }
        break;
      case "cardNumber":
        const digits = value.replace(/\s/g, "");
        if (!/^\d{16}$/.test(digits)) {
          return "Card number must be exactly 16 digits.";
        }
        break;
      case "expiryDate":
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
          return "Invalid format (MM/YY).";
        } else {
          const [month, year] = value.split("/").map(Number);
          const now = new Date();
          const expiry = new Date(2000 + year, month);
          if (expiry < now) return "Card is expired.";
        }
        break;
      case "cvv":
        if (!/^\d{3}$/.test(value)) return "CVV must be 3 digits.";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cardNumber") {
      newValue = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    }

    if (name === "expiryDate") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
      if (newValue.length >= 3) {
        newValue = `${newValue.slice(0, 2)}/${newValue.slice(2)}`;
      }
    }

    setCardData({ ...cardData, [name]: newValue });
    setErrors({ ...errors, [name]: validateField(name, newValue) });
  };

  const getNextTransactionId = () => {
    const lastId = parseInt(localStorage.getItem("lastTxnId") || "1000");
    const nextId = lastId + 1;
    localStorage.setItem("lastTxnId", nextId);
    return `TXN${nextId}`;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(cardData).forEach((key) => {
      const err = validateField(key, cardData[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateAll()) return;

    const transactionId = getNextTransactionId();

    const paymentPayload = {
      userId,
      orderId,
      amount: parseFloat(cardData.amount),
      paymentMethod: "Card",
      status: "Pending",
      transactionId,
    };

    try {
      await axios.post("http://localhost:5000/api/ITPM/payments", paymentPayload);

      setSuccessMsg(`Payment of Rs.${cardData.amount} Successful! Txn ID: ${transactionId}`);
      setShowAlert(true);

      setTimeout(() => {
        navigate(`/my-orders/${customerEmail}`);
      }, 1500);

      setCardData({ amount: "", cardNumber: "", expiryDate: "", cvv: "" });
      setErrors({});
    } catch (error) {
      console.error("Payment failed:", error.response?.data || error.message);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-lg shadow-lg p-6 rounded-2xl border border-blue-gray-100">
        <CardBody>
          {showAlert && (
            <div className="mb-4 p-4 text-green-800 bg-green-100 rounded-lg border border-green-300">
              <strong className="block font-medium">Success!</strong>
              <span className="text-sm">{successMsg}</span>
            </div>
          )}

          <Typography variant="h4" className="text-center text-blue-gray-900 mb-6">
            Secure Card Payment
          </Typography>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">Amount</label>
              <Input
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={cardData.amount}
                onChange={handleChange}
                className="bg-white"
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-gray-700 mb-1">Card Number</label>
              <Input
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.cardNumber}
                onChange={handleChange}
                className="bg-white"
              />
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-blue-gray-700 mb-1">Expiry Date</label>
                <Input
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChange={handleChange}
                  className="bg-white"
                />
                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-blue-gray-700 mb-1">CVV</label>
                <Input
                  name="cvv"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={handleChange}
                  maxLength={3}
                  className="bg-white"
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>

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
