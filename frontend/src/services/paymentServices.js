import axios from "axios";

const API_URL = "http://localhost:5000/api/ITPM/payments"; // Backend API URL

// ===========================
// User Payment Services
// ===========================

// Create Payment (User)
export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}`, paymentData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get All Payments (User)
export const getUserPayments = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Update Payment (User can only update before approval)
export const updateUserPayment = async (paymentId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${paymentId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Delete Payment (Users can only delete before approval)
export const deleteUserPayment = async (paymentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// ===========================
//  Manager Payment Services
// ===========================

// Get All Payments (Manager View)
export const getManagerPayments = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Approve/Reject Payment (Manager)
export const approvePayment = async (paymentId, status) => {
  try {
    const response = await axios.put(`${API_URL}/approve/${paymentId}`, { status });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// ===========================
// Admin Payment Services
// ===========================

// Get All Payments (Admin)
export const getAllPayments = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get Payment Details (Admin)
export const getPaymentDetails = async (paymentId) => {
  try {
    const response = await axios.get(`${API_URL}/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Update Payment (Admin)
export const updateAdminPayment = async (paymentId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${paymentId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Delete Payment (Admin)
export const deleteAdminPayment = async (paymentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// ===========================
// Report Generation Services (Admin)
// ===========================

// Generate Payment Report (Daily, Weekly, Monthly)
export const generatePaymentReport = async (type) => {
  try {
    const response = await axios.get(`${API_URL}/report/${type}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
