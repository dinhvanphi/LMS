const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// API gửi OTP
router.post('/send-otp', authController.sendOTP);

// API xác thực OTP
router.post('/verify-otp', authController.verifyOTP);

// API đăng ký student
router.post('/register', authController.register);

module.exports = router;
