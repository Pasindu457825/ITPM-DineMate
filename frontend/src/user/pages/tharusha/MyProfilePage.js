import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Input,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const MyProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone_no: "",
    website: "",
  });

  // Notification / error states
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // For delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const handleMyPaymentsClick = () => {
    if (!user) return;
  
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: user._id,
        name: `${user.fname} ${user.lname}`,
        email: user.email,
      })
    );
  
    navigate("/myhistory");
  };


  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found. Redirecting to login...");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/ITPM/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setFormData({
          fname: res.data.fname || "",
          lname: res.data.lname || "",
          email: res.data.email || "",
          phone_no: res.data.phone_no || "",
          website: res.data.website || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        showNotification("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle text changes in form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show a temporary notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Save changes to profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirm dialog before saving
    const confirmed = window.confirm("Are you sure you want to change your profile information?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Authentication error. Please login again.", "error");
        setLoading(false);
        return;
      }

      // Since email is disabled in the UI, we won't send it if you truly want no changes to email
      const { fname, lname, phone_no } = formData;
      const updateData = { fname, lname, phone_no };

      const res = await axios.put(
        `http://localhost:5000/api/ITPM/users/${user._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      showNotification("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      showNotification("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Account Functions
  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setDeleteInput("");
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteInput("");
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Authentication error. Please login again.", "error");
        setDeleting(false);
        return;
      }

      // Call DELETE endpoint
      await axios.delete(`http://localhost:5000/api/ITPM/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Show black notification bar for delete
      showNotification("Account deleted successfully!", "delete");

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      // Show black notification bar for delete
      showNotification("Failed to delete account", "delete");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Spinner className="h-12 w-12 text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="w-96 p-6 bg-white shadow-md rounded-lg">
          <Typography variant="h5" className="text-center text-red-500">
            Not logged in
          </Typography>
          <Typography className="text-center mt-4 text-gray-600">
            Please login to view your profile
          </Typography>
          <div className="mt-4">
            <Button
              fullWidth
              className="bg-blue-gray-900 text-white"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Notification Banner */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg z-50 shadow-lg ${
            notification.type === "delete"
              ? "bg-black"
              : notification.type === "success"
              ? "bg-blue-gray-900"
              : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} handler={closeDeleteModal}  className="bg-gray-900 bg-opacity-90 backdrop-blur-sm border border-gray-700">
        <DialogHeader  className="text-white">Delete Account</DialogHeader>
        <DialogBody>
          <Typography  className="text-white">
            Are you sure you want to delete your account? This action is permanent.
          </Typography>
          <Typography  className="mt-4 text-white">
            To confirm, type <span className="text-red-500 font-bold">deleteme</span> below:
          </Typography>
          <Input
            variant="outlined"
            color="red"
            label="Type 'deleteme' to confirm"
            className="mt-2"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
          />
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" onClick={closeDeleteModal} className="text-gray-500">
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDeleteAccount}
            disabled={deleteInput !== "deleteme" || deleting}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-6 flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center overflow-hidden">
            <Typography variant="h1" className="text-gray-600">
              {user?.fname?.charAt(0)}
              {user?.lname?.charAt(0)}
            </Typography>
          </div>
          <ul className="w-full space-y-1 mt-6">
            <li>
              <button className="w-full text-left p-3 flex items-center bg-blue-gray-900 text-white rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </button>
            </li>
            <li>
              <button 
              onClick={handleMyPaymentsClick} //My payment button added

              className="w-full text-left p-3 flex items-center bg-blue-gray-900 text-white rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  My Payments
                </button>
              </li>
            <li>
              <button className="w-full text-left p-3 flex items-center bg-blue-gray-900 text-white rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >

                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Account Details
              </button>
            </li>
            <li>
              <button className="w-full text-left p-3 flex items-center bg-blue-gray-900 text-white rounded-md" onClick={() => navigate("/forgot-password")}>
              
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Change Password
              </button>
            </li>
            <li>
              <button className="w-full text-left p-3 flex items-center bg-blue-gray-900 text-white rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Logout
              </button>
            </li>
            <li className="pt-4">
              <button
                onClick={openDeleteModal}
                className="w-full text-left p-3 flex items-center bg-blue-gray-900 text-white rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete Account
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Account Settings</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
                placeholder="Email address"
                required
                disabled  // <--- Email is not editable
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <Input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full"
                placeholder="First name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <Input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full"
                placeholder="Last name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                className="w-full"
                placeholder="Phone number"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="bg-blue-gray-900 text-white"
                disabled={loading}
              >
                {loading ? <Spinner className="h-4 w-4 mx-auto" /> : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfilePage;
