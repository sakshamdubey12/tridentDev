const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, logout,updateDetails,contactUs } = require('../controllers/authController');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/logout', logout);
router.put('/update', updateDetails);
router.post('/contact', contactUs);

module.exports = router;
