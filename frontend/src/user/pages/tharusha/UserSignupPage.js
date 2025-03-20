import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const UserSignupPage = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    pwd: "",
    phone_no: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // For multi-step form
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.fname.trim() || !formData.lname.trim()) {
      setError("Please enter both first and last name");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.pwd.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone_no)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await axios.post("http://localhost:5000/api/ITPM/users/signup/user", {
        ...formData,
        role: "registered_user",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
          <p className="mt-2 text-gray-300">Join our restaurant community</p>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-700' : 'bg-gray-600'}`}>
              <span className="text-white">1</span>
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-700' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-700' : 'bg-gray-600'}`}>
              <span className="text-white">2</span>
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-700' : 'bg-gray-600'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-700' : 'bg-gray-600'}`}>
              <span className="text-white">3</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-200 bg-red-900 bg-opacity-25 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="fname" className="block text-sm font-medium text-gray-300">
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.fname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="John"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="lname" className="block text-sm font-medium text-gray-300">
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="lname"
                    name="lname"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
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
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="pwd" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="pwd"
                    name="pwd"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.pwd}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">Password must be at least 6 characters</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="phone_no" className="block text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phone_no"
                    name="phone_no"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone_no}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="1234567890"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">Enter a 10-digit phone number</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 flex justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing up...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignupPage;