import React, { useEffect, useState } from "react";
import axios from "axios";

const MyProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          console.log("No token are found in. User might not be logged in.");
          return;
        }

        // Send token in Authorization header
        const res = await axios.get("http://localhost:5000/api/ITPM/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div>Loading or not logged in...</div>;
  }

  return (
    <div>
      <h2>My Profile</h2>
      <p><strong>First Name:</strong> {user.fname}</p>
      <p><strong>Last Name:</strong> {user.lname}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone_no}</p>
      {/* <p><strong>Role:</strong> {user.role}</p> */}
    </div>
  );
};

export default MyProfilePage;
