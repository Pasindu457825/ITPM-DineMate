import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", pwd: "" });
  const navigate = useNavigate();

  // Update form data as user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the backend login API
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/users/login",
        formData
      );

      // Extract JWT token, role, userId from response
      const { token, role, userId } = response.data;
      alert("Login successful!");
      console.log("Login Response:", response.data);

      // Store token & other user info in localStorage (or sessionStorage)
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // Redirect to home or profile, depending on your app flow
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials!");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="pwd"
          placeholder="Password"
          value={formData.pwd}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
