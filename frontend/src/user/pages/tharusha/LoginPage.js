import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", pwd: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Update form data as user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // 1) Call the backend login API
      const response = await axios.post(
        "http://localhost:5000/api/ITPM/users/login",
        formData
      );

      // 2) Extract JWT token, role, userId from response
      const { token, role, userId } = response.data;
      console.log("Login Response:", response.data);

      // 3) Store token & other user info in localStorage (or sessionStorage)
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // 4) Redirect to different pages depending on role
      if (role === "restaurant_manager") {
        navigate("/managers");
      } else if (role === "admin") {
        navigate("/admindashboard");
      } else {
        // Default: Registered user
        navigate("/me");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-300">Sign in to your restaurant account</p>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-200 bg-red-900 bg-opacity-25 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="pwd" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="pwd"
                  name="pwd"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.pwd}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-400 hover:text-blue-300">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;