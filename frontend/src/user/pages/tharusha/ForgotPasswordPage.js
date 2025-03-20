// ForgotPasswordPage.js
import React, { useState } from "react";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setError("");
    try {
      // Make request to your backend
      const res = await axios.post("http://localhost:5000/api/ITPM/users/forgot-password-otp", {
        email,
      });

      // The backend typically responds with something like:
      // { message: "OTP sent if the account exists." }
      setStatusMessage(res.data.message);
      setEmail("");
    } catch (err) {
      console.error("Error sending OTP:", err.response?.data || err.message);
      setError("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div style={{ margin: "2rem" }}>
      <h1>Forgot Password</h1>
      <p>Enter your email to receive an OTP.</p>

      {statusMessage && <div style={{ color: "green" }}>{statusMessage}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginLeft: "1rem" }}
          />
        </label>
        <br />
        <button type="submit" style={{ marginTop: "1rem" }}>
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
