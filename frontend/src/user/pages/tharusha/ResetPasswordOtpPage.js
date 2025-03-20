// ResetPasswordOtpPage.js
import React, { useState } from "react";
import axios from "axios";

const ResetPasswordOtpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPwd: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setStatusMessage("");
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setError("");

    try {
      // Make request to your backend
      const res = await axios.post("http://localhost:5000/api/ITPM/users/reset-password-otp", {
        email: formData.email,
        otp: formData.otp,
        newPwd: formData.newPwd,
      });

      // If successful, you'll get { message: "Password reset successful." }
      setStatusMessage(res.data.message);
      // Optionally clear form
      setFormData({ email: "", otp: "", newPwd: "" });
    } catch (err) {
      console.error("Error resetting password:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Failed to reset password. Please try again."
      );
    }
  };

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Reset Password with OTP</h1>
      <p>Enter the OTP sent to your email, along with your email address and new password.</p>

      {statusMessage && <div style={{ color: "green" }}>{statusMessage}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>OTP: </label>
          <input
            type="text"
            name="otp"
            required
            value={formData.otp}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>New Password: </label>
          <input
            type="password"
            name="newPwd"
            required
            value={formData.newPwd}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordOtpPage;
