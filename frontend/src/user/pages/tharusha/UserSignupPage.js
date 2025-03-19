import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserSignupPage = () => {
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
      await axios.post("http://localhost:5000/api/ITPM/users/signup/user", {
        ...formData,
        role: "registered_user",
      });
      alert("User registered successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div>
      <h2>User Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fname" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="lname" placeholder="Last Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="pwd" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="phone_no" placeholder="Phone Number" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default UserSignupPage;
