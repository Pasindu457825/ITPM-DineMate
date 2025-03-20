import React, { useState } from "react";
import axios from "axios";
import "./ForgotPasswordPage.css"; // Make sure to create this CSS file

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setError("");
    setIsLoading(true);
    
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="card-header">
          <h1>Forgot Password</h1>
          <p>Enter your email address to receive a one-time password</p>
        </div>

        {statusMessage && <div className="status-message success">{statusMessage}</div>}
        {error && <div className="status-message error">{error}</div>}

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              required
              placeholder="your.email@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => window.location.href = "/reset-password-otp"}
            >
              Reset Your Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;