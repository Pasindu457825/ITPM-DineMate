import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";

const CompletedPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ITPM/payments");
      const completed = res.data.filter((p) => p.status === "Completed");
      setPayments(completed);
      setFilteredPayments(filterByTab(completed, activeTab));
    } catch (err) {
      console.error("Error fetching payments:", err.message);
    }
  };

  const filterByTab = (data, tab) => {
    if (tab === "Cash") return data.filter((p) => p.paymentMethod === "Cash");
    if (tab === "Card") return data.filter((p) => p.paymentMethod === "Card");
    return data; // All
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = filterByTab(payments, activeTab).filter((p) =>
      p.transactionId.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const filtered = filterByTab(payments, tab).filter((p) =>
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Typography variant="h4" className="mb-6 text-blue-gray-900">
        Completed Payments
      </Typography>

      {/* Search & Tabs */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <span className="absolute left-3 top-2.5 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.65 6.15z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by Txn ID..."
            className="w-full pl-10 pr-4 py-2 border border-blue-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {["All", "Cash", "Card"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 text-sm rounded-full border transition ${
                activeTab === tab
                  ? "bg-blue-gray-900 text-white"
                  : "bg-white text-blue-gray-700 border-blue-gray-200 hover:bg-blue-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-x-auto">
        <CardBody className="p-0">
          <table className="w-full text-left min-w-max table-auto">
            <thead className="bg-blue-gray-100">
              <tr>
                <th className="p-4">Txn ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="border-b border-blue-gray-50">
                  <td className="p-4">{payment.transactionId}</td>
                  <td className="p-4">Rs.{payment.amount}</td>
                  <td className="p-4">{payment.paymentMethod}</td>
                  <td className="p-4 text-green-600 font-medium">{payment.status}</td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No completed payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default CompletedPaymentsPage;
