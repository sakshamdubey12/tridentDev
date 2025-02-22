// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/orderController');
// const paymentController = require('../controllers/paymentController');

// router.get('/', orderController.getOrders);
// router.post('/orders', orderController.createOrder);
// router.post('/create-razorpay-order', paymentController.createRazorpayOrder);
// module.exports = router;


const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');

// Order-related routes
router.get('/allOrders', orderController.getOrders);
router.put('/updateStatus', orderController.updateOrderStatus);

// Payment-related routes
// router.post('/create-razorpay-order', paymentController.createRazorpayOrder);
// router.post('/verify-payment', paymentController.verifyPaymentAndCreateOrder);

module.exports = router;
