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
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateStep1 = () => {
    // First and Last Name Validation
    const nameRegex = /^[a-zA-Z\s-]+$/;
    if (!formData.fname.trim() || !formData.lname.trim()) {
      setError("Please enter both first and last name");
      return false;
    }
    if (formData.fname.length < 2 || formData.fname.length > 50) {
      setError("First name must be between 2 and 50 characters");
      return false;
    }
    if (!nameRegex.test(formData.fname)) {
      setError("First name can only contain letters, spaces, and hyphens");
      return false;
    }
    if (formData.lname.length < 2 || formData.lname.length > 50) {
      setError("Last name must be between 2 and 50 characters");
      return false;
    }
    if (!nameRegex.test(formData.lname)) {
      setError("Last name can only contain letters, spaces, and hyphens");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // Email and Password Validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.pwd.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!pwdRegex.test(formData.pwd)) {
      setError("Password must contain at least one letter and one number");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    // Phone Number Validation (Sri Lankan format)
    const phoneRegex = /^(?:\+94\d{9}|0\d{9})$/;
    if (!phoneRegex.test(formData.phone_no)) {
      setError("Please enter a valid Sri Lankan phone number (e.g., 0712345678 or +94712345678)");
      return false;
    }
    const cleaned = formData.phone_no.startsWith('+94') 
      ? formData.phone_no.replace('+94', '') 
      : formData.phone_no.replace(/^0/, '');
    if (cleaned.length !== 9) {
      setError("Phone number must be exactly 10 digits including the mobile code");
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
    
    if (!validateStep3()) {
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Create Your Account</h1>
          <p className="mt-2 text-gray-600">Join our restaurant community</p>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className="text-white">1</span>
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className="text-white">2</span>
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className="text-white">3</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="fname" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="fname"
                  name="fname"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.fname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="John"
                />
                <p className="mt-1 text-xs text-gray-500">2-50 characters, letters only</p>
              </div>
              
              <div>
                <label htmlFor="lname" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lname"
                  name="lname"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Doe"
                />
                <p className="mt-1 text-xs text-gray-500">2-50 characters, letters only</p>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="pwd" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="pwd"
                  name="pwd"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.pwd}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">Min 6 characters, must include a letter and number</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone_no"
                  name="phone_no"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone_no}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="0712345678 or +94712345678"
                />
                <p className="mt-1 text-xs text-gray-500">Enter a 10-digit Sri Lankan number</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/2 flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
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
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignupPage;