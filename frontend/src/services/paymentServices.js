import axios from "axios";

const API_URL = "http://localhost:5000/api/ITPM/payments"; // Backend API URL

// ============  USER PAYMENT SERVICES =============
// Create Payment (User)
export const createPayment = async (paymentData) => {
  return await axios.post(`${API_URL}`, paymentData);
};

// Get Payments (User)
export const getUserPayments = async (userId) => {
  return await axios.get(`${API_URL}/user/${userId}`);
};

// Update Payment (User)
export const updateUserPayment = async (paymentId, updatedData) => {
  return await axios.put(`${API_URL}/${paymentId}`, updatedData);
};

// Delete Payment (User)
export const deleteUserPayment = async (paymentId) => {
  return await axios.delete(`${API_URL}/${paymentId}`);
};

// ============  MANAGER PAYMENT SERVICES =============
// Get All Payments (Manager)
export const getManagerPayments = async () => {
  return await axios.get(`${API_URL}`);
};

// Approve/Reject Payment (Manager)
export const approvePayment = async (paymentId, status) => {
  return await axios.put(`${API_URL}/approve/${paymentId}`, { status });
};
