const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/Isuri/paymentController');

if (!paymentController) {
  console.error("Error: Payment Controller not found.");
}

// Routes
router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);
router.get('/report', paymentController.getPaymentReport);
router.get('/report-range', paymentController.getPaymentReportByDateRange);


module.exports = router;
