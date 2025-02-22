const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/paymentController');

// Route to create Razorpay order
router.post('/create-razorpay-order', createRazorpayOrder);

// Route to verify Razorpay payment and create order in the database
router.post('/verify-razorpay-payment', verifyRazorpayPayment);

module.exports = router;
