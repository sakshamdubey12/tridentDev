const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel');

// Initialize Razorpay instance with your API key and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { user, totalAmount, items} = req.body;
    if (!user || !totalAmount || !items  ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Create a Razorpay order
    const options = {
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `order_rcptid_${new Date().getTime()}`,
      payment_capture: 1, // Auto capture payment
    };
    const order = await razorpay.orders.create(options);

    // Send Razorpay order details to frontend
    res.status(200).json({
      id: order.id,
      amount: totalAmount * 100,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
  }
};

// Verify Razorpay Payment Signature and Create Order in Database
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { user, totalAmount, items, payment, name, phone,address  } = req.body;

    if (!user || !totalAmount || !items || !payment?.orderId || !payment?.paymentId || !payment?.signature|| !name || !phone || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify Razorpay payment signature
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(payment.orderId + "|" + payment.paymentId)
      .digest('hex');

    if (expectedSignature !== payment.signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Create the order in the database
    const order = new Order({
      user,
      totalAmount,
      items,
      name,
      phone,
      address,
      payment: {
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        signature: payment.signature,
        status: 'Paid', // Mark as paid after verification
      },
      status: 'Processing',
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
};
