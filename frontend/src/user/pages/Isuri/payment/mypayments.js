import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ITPM/payments");
        const userPayments = res.data.filter(p => p.userId === user._id);
        setPayments(userPayments);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user._id]);

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 flex flex-col items-center">
      <Card className="w-full max-w-4xl p-6 shadow-lg rounded-2xl border border-blue-gray-100">
        <CardBody>
          <Typography variant="h4" className="mb-6 text-center text-blue-gray-900">
            My Payments
          </Typography>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner color="blue" />
            </div>
          ) : payments.length === 0 ? (
            <p className="text-center text-blue-gray-600">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border text-left">
                <thead>
                  <tr className="bg-blue-gray-100 text-blue-gray-700">
                    <th className="p-3">Txn ID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.transactionId} className="border-t">
                      <td className="p-3">{payment.transactionId}</td>
                      <td className="p-3">Rs.{payment.amount.toFixed(2)}</td>
                      <td className="p-3">{payment.paymentMethod}</td>
                      <td className="p-3">{payment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MyPayments;
