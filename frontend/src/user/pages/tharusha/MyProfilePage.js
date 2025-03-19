import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Input,
  Spinner,
  IconButton,
} from "@material-tailwind/react";

const MyProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone_no: "",
  });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found. Redirecting to login...");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/ITPM/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Profile fetched:", res.data);
        sessionStorage.setItem("userProfile", JSON.stringify(res.data));
        setUser(res.data);
        setFormData({
          fname: res.data.fname,
          lname: res.data.lname,
          email: res.data.email,
          phone_no: res.data.phone_no,
        });
      } catch (error) {
        console.error(
          "❌ Error fetching profile:",
          error.response?.data || error.message
        );
        showNotification("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Authentication error. Please login again.", "error");
        setLoading(false);
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/ITPM/users/${user._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Profile updated:", res.data);
      setUser(res.data);
      setIsEditing(false);
      showNotification("Profile updated successfully!", "success");
      
      // Update session storage
      sessionStorage.setItem("userProfile", JSON.stringify(res.data));
    } catch (error) {
      console.error(
        "❌ Error updating profile:",
        error.response?.data || error.message
      );
      showNotification("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Spinner className="h-12 w-12 text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Card className="w-96 bg-gray-800 text-white">
          <CardBody>
            <Typography variant="h5" className="text-center text-red-400">
              Not logged in
            </Typography>
            <Typography className="text-center mt-4 text-gray-300">
              Please login to view your profile
            </Typography>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              fullWidth
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = "/login"}
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 py-8 px-4">
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg z-50 ${
          notification.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          <Typography className="text-white">{notification.message}</Typography>
        </div>
      )}
      
      <Card className="w-full max-w-md bg-gray-800 text-white shadow-xl">
        <CardHeader
          variant="gradient"
          color="blue"
          className="h-52 flex flex-col justify-end items-center mb-4 bg-gradient-to-r from-blue-700 to-purple-600"
        >
          <div className="h-24 w-24 rounded-full bg-gray-100 mb-2 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
            <Typography variant="h1" className="text-gray-700">
              {user.fname?.charAt(0)}{user.lname?.charAt(0)}
            </Typography>
          </div>
          <Typography variant="h4" className="text-white mb-2">
            {!isEditing ? `${user.fname} ${user.lname}` : "Edit Profile"}
          </Typography>
          <Typography className="text-blue-100 opacity-80">
            {!isEditing ? user.role : "Update your information"}
          </Typography>
        </CardHeader>
        
        <CardBody className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Typography className="text-gray-400 mb-2">First Name</Typography>
                  <Input
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    className="text-white !border-gray-500 focus:!border-blue-500"
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{
                      className: "bg-gray-700 rounded",
                    }}
                    required
                  />
                </div>
                
                <div>
                  <Typography className="text-gray-400 mb-2">Last Name</Typography>
                  <Input
                    type="text"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                    className="text-white !border-gray-500 focus:!border-blue-500"
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{
                      className: "bg-gray-700 rounded",
                    }}
                    required
                  />
                </div>
                
                <div>
                  <Typography className="text-gray-400 mb-2">Email</Typography>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="text-white !border-gray-500 focus:!border-blue-500"
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{
                      className: "bg-gray-700 rounded",
                    }}
                    required
                  />
                </div>
                
                <div>
                  <Typography className="text-gray-400 mb-2">Phone Number</Typography>
                  <Input
                    type="text"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    className="text-white !border-gray-500 focus:!border-blue-500"
                    labelProps={{
                      className: "hidden",
                    }}
                    containerProps={{
                      className: "bg-gray-700 rounded",
                    }}
                    required
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded">
                <Typography className="text-sm text-gray-400 mb-1">First Name</Typography>
                <Typography className="text-gray-100 font-medium">{user.fname}</Typography>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <Typography className="text-sm text-gray-400 mb-1">Last Name</Typography>
                <Typography className="text-gray-100 font-medium">{user.lname}</Typography>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <Typography className="text-sm text-gray-400 mb-1">Email</Typography>
                <Typography className="text-gray-100 font-medium">{user.email}</Typography>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <Typography className="text-sm text-gray-400 mb-1">Phone Number</Typography>
                <Typography className="text-gray-100 font-medium">{user.phone_no}</Typography>
              </div>
              
              <div className="bg-gray-700 p-4 rounded">
                <Typography className="text-sm text-gray-400 mb-1">User Role</Typography>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <Typography className="text-gray-100 font-medium capitalize">{user.role}</Typography>
                </div>
              </div>
            </div>
          )}
        </CardBody>
        
        <CardFooter className="p-6 pt-0">
          {isEditing ? (
            <div className="flex gap-4">
              <Button
                fullWidth
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Spinner className="h-4 w-4 mx-auto" /> : "Save Changes"}
              </Button>
              <Button
                fullWidth
                className="bg-gray-600 hover:bg-gray-700"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                    phone_no: user.phone_no,
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              fullWidth
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MyProfilePage;