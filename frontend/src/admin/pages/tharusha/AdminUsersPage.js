import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Spinner,
  Input,
  Button,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // fetch all users (public endpoint)
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/ITPM/users")
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error(err);
        setErrMsg(err.response?.data?.message || "Failed to fetch users.");
      })
      .finally(() => setLoading(false));
  }, []);

  // filter by text + date
  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return users.filter((u) => {
      const textMatch =
        u.fname.toLowerCase().includes(lower) ||
        u.lname.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower);

      const created = new Date(u.createdAt).toISOString().slice(0, 10);
      const afterStart = startDate ? created >= startDate : true;
      const beforeEnd = endDate ? created <= endDate : true;

      return textMatch && afterStart && beforeEnd;
    });
  }, [users, search, startDate, endDate]);

  // PDF export
  const handleDownloadPdf = () => {
    if (!filtered.length) {
      alert("Nothing to export – change filters or add users.");
      return;
    }
    const doc = new jsPDF({ orientation: "landscape" });
    
    // Add header with date
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${today}`, 14, 10);
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Users Management Report", 14, 20);
    
    autoTable(doc, {
      startY: 30,
      head: [["#", "First Name", "Last Name", "Email", "Phone", "Role", "Joined"]],
      body: filtered.map((u, i) => [
        i + 1,
        u.fname,
        u.lname,
        u.email,
        u.phone_no,
        u.role,
        new Date(u.createdAt).toLocaleDateString(),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [71, 85, 105] },
    });
    
    doc.save("users_report.pdf");
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner className="h-12 w-12 text-blue-500 mb-4" />
          <Typography variant="h6" color="blue-gray">
            Loading user data...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <Typography variant="h3" className="text-gray-800 font-bold">
              User Management
            </Typography>
            <Typography color="blue-gray" className="mt-1">
              {filtered.length} {filtered.length === 1 ? "user" : "users"} found
            </Typography>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm"
              className="flex items-center gap-2 bg-blue-500 shadow-md"
              onClick={handleDownloadPdf}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export PDF
            </Button>
            <Button 
              size="sm"
              className="flex items-center gap-2 bg-green-500 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Add User
            </Button>
          </div>
        </div>

        {errMsg ? (
          <Card className="mb-6 border border-red-100">
            <CardBody className="p-4 bg-red-50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-500/20 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <Typography className="font-medium text-red-700">
                  {errMsg}
                </Typography>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card className="mb-6 shadow-sm border border-gray-200">
              <CardBody className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <Typography variant="small" className="mb-2 font-medium text-blue-gray-500">
                      Search
                    </Typography>
                    <Input
                      size="md"
                      label="Search name or email"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="!text-gray-900"
                      icon={
                        search && (
                          <button onClick={() => setSearch("")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )
                      }
                    />
                  </div>
                  
                  <div>
                    <Typography variant="small" className="mb-2 font-medium text-blue-gray-500">
                      Joined from
                    </Typography>
                    <Input
                      type="date"
                      size="md"
                      label="Start date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="!text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <Typography variant="small" className="mb-2 font-medium text-blue-gray-500">
                      Joined to
                    </Typography>
                    <Input
                      type="date"
                      size="md"
                      label="End date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="!text-gray-900"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      variant="text" 
                      color="blue-gray" 
                      className="flex items-center gap-2 normal-case"
                      disabled={!search && !startDate && !endDate}
                      onClick={handleResetFilters}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-sm border border-gray-200 overflow-hidden">
              <CardHeader floated={false} shadow={false} className="rounded-none bg-white pt-4 pb-2 px-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                  <div>
                    <Typography variant="h5" color="blue-gray" className="mb-1">
                      Users List
                    </Typography>
                    <Typography variant="small" color="gray" className="font-normal">
                      Showing {filtered.length} out of {users.length} total users
                    </Typography>
                  </div>
                </div>
              </CardHeader>
              
              <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {["#", "Name", "Email", "Phone", "Role", "Joined", "Actions"].map((head) => (
                        <th
                          key={head}
                          className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold leading-none"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {!filtered.length ? (
                      <tr>
                        <td colSpan="7" className="p-4 text-center">
                          <div className="flex flex-col items-center py-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-blue-gray-200 mb-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            <Typography color="blue-gray" className="font-medium">
                              No users match your filters
                            </Typography>
                            <Typography variant="small" color="gray" className="max-w-xs mt-1">
                              Try adjusting your search or filter parameters
                            </Typography>
                            <Button 
                              variant="text" 
                              size="sm" 
                              color="blue" 
                              className="mt-3"
                              onClick={handleResetFilters}
                            >
                              Clear All Filters
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((user, index) => {
                        const isLast = index === filtered.length - 1;
                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
 
                        return (
                          <tr key={user._id} className="hover:bg-blue-gray-50/30">
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {index + 1}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <div className="flex flex-col">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                  {user.fname} {user.lname}
                                </Typography>
                              </div>
                            </td>
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {user.email}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {user.phone_no}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <div className="w-max">
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  user.role === "admin" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : user.role === "manager" 
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-green-100 text-green-800"
                                }`}>
                                  {user.role}
                                </div>
                              </div>
                            </td>
                            <td className={classes}>
                              <Typography variant="small" color="blue-gray" className="font-normal">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <div className="flex items-center gap-2">
                                <Tooltip content="Edit User">
                                  <IconButton variant="text" color="blue-gray" size="sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip content="View Details">
                                  <IconButton variant="text" color="blue" size="sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;