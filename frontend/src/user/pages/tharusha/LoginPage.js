import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  /* --------------------------- state & hooks --------------------------- */
  const [formData, setFormData] = useState({ email: "", pwd: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");     // ✅ holds success banner text
  const navigate = useNavigate();

  /* --------------------------- handlers -------------------------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      /* 1) back-end call */
      const { data } = await axios.post(
        "http://localhost:5000/api/ITPM/users/login",
        formData
      );

      /* 2) store JWT & info */
      const { token, role, userId } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      /* 3) show banner then redirect */
      setSuccess("Login successful — redirecting…");

      setTimeout(() => {
        if (role === "restaurant_manager") navigate("/managers");
        else if (role === "admin")         navigate("/admindashboard");
        else                               navigate("/");           // registered user
      }, 4000);   // 2.5 s → gives Selenium plenty of time
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------ UI ----------------------------------- */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        {/* header -------------------------------------------------------- */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to your restaurant account</p>
        </div>

        {/* alerts -------------------------------------------------------- */}
        {error && (
          <div
            id="error-banner"
            className="p-3 text-sm text-red-700 bg-red-100 rounded-md"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            id="success-banner"    /* 👈 easy, stable locator for Selenium */
            className="p-3 text-sm text-green-800 bg-green-100 rounded-md"
          >
            {success}
          </div>
        )}

        {/* form ---------------------------------------------------------- */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* email ---------------------------------------------------- */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                placeholder="your.email@example.com"
              />
            </div>

            {/* password ------------------------------------------------- */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="pwd" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="pwd"
                name="pwd"
                type="password"
                required
                value={formData.pwd}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* submit ----------------------------------------------------- */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* footer link -------------------------------------------------- */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup/user" className="text-blue-600 hover:text-blue-800">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
