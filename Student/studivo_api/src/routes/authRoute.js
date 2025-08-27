const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authService = require('../services/authService'); // Thêm import này

// API gửi OTP
router.post('/send-otp', authController.sendOTP);

// API xác thực OTP
router.post('/verify-otp', authController.verifyOTP);

// API đăng ký student
router.post('/register', authController.register);

// Thêm endpoint login
router.post('/login', async (req, res) => {
  try {
    console.log('📧 Login request:', req.body);
    
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và password là bắt buộc'
      });
    }

    // Gọi service login
    const result = await authService.login(email, password);
    
    console.log('✅ Login successful for:', email);
    
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result
    });
    
  } catch (error) {
    console.error('❌ Login error:', error.message);
    
    if (error.message === 'Email không tồn tại' || 
        error.message === 'Mật khẩu không chính xác') {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }
    
    if (error.message === 'Tài khoản chưa được kích hoạt') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản chưa được kích hoạt'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router;
