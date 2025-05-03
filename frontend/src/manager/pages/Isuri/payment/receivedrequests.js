import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const ManagerPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ITPM/payments");
      const pending = res.data.filter((p) => p.status === "Pending");
      setPayments(pending);
      setFilteredPayments(filterByTab(pending, activeTab));
    } catch (err) {
      console.error("Error fetching payments:", err.message);
    }
  };

  const updateStatus = async (id, action) => {
    const message =
      action === "Completed"
        ? "Are you sure you want to mark this payment as Completed?"
        : "Are you sure you want to mark this payment as Decline?";

    setConfirmMsg(message);
    setConfirmOpen(true);
    setConfirmAction(() => async () => {
      try {
        await axios.put(`http://localhost:5000/api/ITPM/payments/${id}`, {
          status: action === "Completed" ? "Completed" : "Failed",
        });
        setAlertMsg(`Payment marked as ${action}`);
        setAlertType("success");
        setShowAlert(true);
        fetchPayments();
      } catch (err) {
        setAlertMsg("Failed to update payment.");
        setAlertType("error");
        setShowAlert(true);
      } finally {
        setConfirmOpen(false);
        setTimeout(() => setShowAlert(false), 4000);
      }
    });
  };

  const filterByTab = (data, tab) => {
    if (tab === "Cash") return data.filter((p) => p.paymentMethod === "Cash");
    if (tab === "Card") return data.filter((p) => p.paymentMethod === "Card");
    return data;
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = filterByTab(payments, activeTab).filter((p) =>
      p.orderId?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const filtered = filterByTab(payments, tab).filter((p) =>
      p.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Typography variant="h4" className="mb-6 text-blue-gray-900">
        Pending Payments
      </Typography>

      {showAlert && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            alertType === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {alertMsg}
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full border border-gray-200">
            <Typography variant="h6" className="mb-4 text-blue-gray-900">
              Confirmation
            </Typography>
            <p className="text-sm text-blue-gray-700 mb-6">{confirmMsg}</p>
            <div className="flex justify-end gap-3">
              <Button
                size="sm"
                className="bg-gray-300 text-black"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-blue-gray-900 text-white"
                onClick={confirmAction}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
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
            placeholder="Search by Order ID..."
            className="w-full pl-10 pr-4 py-2 border border-blue-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <Button
          size="sm"
          className="bg-blue-gray-900 text-white text-sm px-4 py-2 rounded"
          onClick={() => navigate("/payhistory")}
        >
          View History
        </Button>

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

      <Card className="overflow-x-auto">
        <CardBody className="p-0">
          <table className="w-full text-left min-w-max table-auto">
            <thead className="bg-blue-gray-100">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="border-b border-blue-gray-50">
                  <td className="p-4">{payment.orderId}</td>
                  <td className="p-4">Rs.{payment.amount}</td>
                  <td className="p-4">{payment.paymentMethod}</td>
                  <td className="p-4">
                    <span className="text-yellow-600 font-medium">
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="px-2 py-1 text-xs bg-green-600 w-auto min-w-fit"
                        onClick={() => updateStatus(payment._id, "Completed")}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        className="px-2 py-1 text-xs bg-red-600 w-auto min-w-fit"
                        onClick={() => updateStatus(payment._id, "Decline")}
                      >
                        Decline
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No pending payments found.
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

export default ManagerPaymentsPage;
