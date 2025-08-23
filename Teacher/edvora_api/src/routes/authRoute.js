const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// API gửi OTP cho giáo viên
router.post('/send-otp', authController.sendOTP);

// API xác thực OTP cho giáo viên
router.post('/verify-otp', authController.verifyOTP);

// API đăng ký giáo viên
router.post('/register', authController.register);

module.exports = router;
