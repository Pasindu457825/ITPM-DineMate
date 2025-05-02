const Payment = require('../../models/Isuri/paymentModel'); 

// Ensure all functions are defined before exporting

// Create Payment
async function createPayment(req, res) {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    res.status(201).json({ message: "Payment created successfully", payment: savedPayment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get All Payments
async function getAllPayments(req, res) {
  try {
    const payments = await Payment.find().populate('userId orderId');
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get Payment by ID
async function getPaymentById(req, res) {
  try {
    const payment = await Payment.findById(req.params.id).populate('userId orderId');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update Payment
async function updatePayment(req, res) {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment updated successfully", payment: updatedPayment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete Payment
async function deletePayment(req, res) {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Get daily, weekly, or monthly report
async function getPaymentReport(req, res) {
  try {
    const { type } = req.query;

    let startDate, endDate = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (type === "daily") {
      startDate = new Date(today);
    } else if (type === "weekly") {
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      startDate = new Date(firstDayOfWeek);
    } else if (type === "monthly") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else {
      return res.status(400).json({ message: "Invalid report type" });
    }

    const payments = await Payment.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $in: ["Completed", "Accepted"] },
    });

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      type,
      count: payments.length,
      totalAmount,
      payments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Get report by custom date range
async function getPaymentReportByDateRange(req, res) {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Start and End dates are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999); // Include full end day

    const payments = await Payment.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $in: ["Accepted", "Completed"] },
    });

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      from: start,
      to: end,
      count: payments.length,
      totalAmount,
      payments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// Correctly export all functions
module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentReport,
  getPaymentReportByDateRange,
};
