import React, { useEffect, useState } from "react";
import axios from "axios";

const MyProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found. Redirecting to login...");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/ITPM/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Profile fetched:", res.data);

        // ✅ Store profile in sessionStorage
        sessionStorage.setItem("userProfile", JSON.stringify(res.data));

        setUser(res.data);
      } catch (error) {
        console.error(
          "❌ Error fetching profile:",
          error.response?.data || error.message
        );
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <div>Loading or not logged in...</div>;

  return (
    <div>
      <h2>My Profile</h2>
      <p>
        <strong>First Name:</strong> {user.fname}
      </p>
      <p>
        <strong>Last Name:</strong> {user.lname}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
};

export default MyProfilePage;
