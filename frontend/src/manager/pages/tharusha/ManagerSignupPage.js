// ManagerSignupPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManagerSignupPage = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    pwd: "",
    phone_no: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1) Sign up the manager
      await axios.post("http://localhost:5000/api/ITPM/users/signup/manager", {
        ...formData,
        role: "restaurant_manager",
      });
      alert("Restaurant Manager registered successfully!");

      // 2) Auto-login right after successful signup
      const loginResponse = await axios.post("http://localhost:5000/api/ITPM/users/login", {
        email: formData.email,
        pwd: formData.pwd,
      });

      // loginResponse.data should contain: { token, role, userId, ... }
      const { token, role, userId } = loginResponse.data;

      // 3) Store token & user info (simulating a “session”)
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // 4) Redirect to manager dashboard or home
      navigate("/manager-dashboard"); 
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div>
      <h2>Restaurant Manager Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fname"
          placeholder="First Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lname"
          placeholder="Last Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="pwd"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_no"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default ManagerSignupPage;
