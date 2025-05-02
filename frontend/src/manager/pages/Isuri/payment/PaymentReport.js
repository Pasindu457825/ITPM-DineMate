import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

const PaymentReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState("");

  const fetchReport = async (type) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/ITPM/payments/report?type=${type}`
      );
      setReportType(type);
      setReportData(res.data);
    } catch (err) {
      console.error("Error fetching report:", err.message);
    }
  };

  const fetchRangeReport = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/ITPM/payments/report-range?start=${startDate}&end=${endDate}`
      );
      setReportType(`Custom (${startDate} → ${endDate})`);
      setReportData(res.data);
    } catch (err) {
      console.error("Error fetching range report:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <Typography variant="h4" className="mb-4 text-blue-gray-900">
        Payment Reports
      </Typography>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={() => fetchReport("daily")} color="blue">Daily</Button>
        <Button onClick={() => fetchReport("weekly")} color="green">Weekly</Button>
        <Button onClick={() => fetchReport("monthly")} color="purple">Monthly</Button>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <div className="flex gap-2 items-center">
          <label>Start:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div className="flex gap-2 items-center">
          <label>End:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <Button onClick={fetchRangeReport} color="orange">
          Generate Report
        </Button>
      </div>

      {/* Report Table */}
      {reportData && (
        <Card className="w-full max-w-4xl shadow-lg border p-4">
          <CardBody>
            <Typography variant="h6" className="mb-2 capitalize">
              {reportType} Report
            </Typography>
            <p className="text-sm mb-1">Total Payments: {reportData.count}</p>
            <p className="text-sm mb-3">
              Total Amount: Rs. {reportData.totalAmount.toFixed(2)}
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-sm">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Txn ID</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Method</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.payments.map((p, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2">{p.transactionId}</td>
                      <td className="p-2">{p.userId || "N/A"}</td>
                      <td className="p-2">Rs. {p.amount}</td>
                      <td className="p-2">{p.paymentMethod}</td>
                      <td className="p-2">{p.status}</td>
                      <td className="p-2">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default PaymentReport;
