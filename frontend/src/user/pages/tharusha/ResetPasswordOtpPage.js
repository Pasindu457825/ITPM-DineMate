import React, { useState } from "react";
import axios from "axios";
import "./ResetPasswordOtpPage.css"; // Make sure to create this CSS file

const ResetPasswordOtpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPwd: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="card-header">
          <h1>Reset Your Password</h1>
          <p>Enter the OTP sent to your email along with your new password</p>
        </div>

        {statusMessage && <div className="alert-message success">{statusMessage}</div>}
        {error && <div className="alert-message error">{error}</div>}

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <i className="material-icons">email</i>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="otp">One-Time Password (OTP)</label>
            <div className="input-with-icon">
              <i className="material-icons">lock_clock</i>
              <input
                id="otp"
                type="text"
                name="otp"
                required
                placeholder="Enter your OTP"
                value={formData.otp}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPwd">New Password</label>
            <div className="input-with-icon">
              <i className="material-icons">lock</i>
              <input
                id="newPwd"
                type={showPassword ? "text" : "password"}
                name="newPwd"
                required
                placeholder="Create a strong password"
                value={formData.newPwd}
                onChange={handleChange}
                className="form-input"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <i className="material-icons">
                  {showPassword ? "visibility_off" : "visibility"}
                </i>
              </button>
            </div>
            <small className="password-hint">Password should be at least 8 characters long</small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-text">
                  <span className="loading-spinner"></span>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
            <a href="/login" className="btn btn-text">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordOtpPage;