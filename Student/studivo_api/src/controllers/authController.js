const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const otpService = require('../services/otpService');

const authController = {
  // API gửi OTP
  sendOTP: async (req, res) => {
    try {
      const { email, first_name } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email là bắt buộc' });
      }
      
      // Kiểm tra email hợp lệ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email không hợp lệ' });
      }
      
      // Gửi OTP
      const result = await otpService.sendOTP(email, first_name);
      
      res.status(200).json({
        message: 'OTP đã được gửi đến email của bạn',
        email: email,
        expireTime: result.expireTime
      });
      
    } catch (error) {
      console.error('Lỗi gửi OTP:', error);
      res.status(500).json({ error: 'Không thể gửi OTP' });
    }
  },

  // API xác thực OTP
  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ error: 'Email và OTP là bắt buộc' });
      }
      
      const isValid = otpService.verifyOTP(email, otp);
      
      if (!isValid) {
        return res.status(400).json({ error: 'OTP không hợp lệ hoặc đã hết hạn' });
      }
      
      // Xóa OTP sau khi xác thực thành công
      otpService.clearOTP(email);
      
      res.status(200).json({
        message: 'Xác thực OTP thành công',
        verified: true
      });
      
    } catch (error) {
      console.error('Lỗi xác thực OTP:', error);
      res.status(500).json({ error: 'Lỗi server' });
    }
  },

  register: async (req, res) => {
    try {
      const { email, password, fullName, first_name, last_name, phone } = req.body;
      
      console.log('📥 Received registration data:', req.body);
      
      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email đã được sử dụng' });
      }
      
      // Hash password
      const password_hash = await bcrypt.hash(password, 10);
      
      // Xử lý tên: ưu tiên first_name/last_name, nếu không có thì split fullName
      let firstName = first_name;
      let lastName = last_name;
      
      if (!firstName && !lastName && fullName) {
        const nameParts = fullName.trim().split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0] || '';
      }
      
      // Validate required fields
      if (!firstName || !lastName) {
        return res.status(400).json({ 
          error: 'Tên và họ là bắt buộc',
          details: 'fullName, first_name, hoặc last_name phải được cung cấp'
        });
      }
      
      console.log('📝 Creating user with:', {
        email,
        first_name: firstName,
        last_name: lastName,
        role: 'student'
      });
      
      // Tạo user mới
      const newUser = await User.create({
        email,
        password_hash,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        role: 'student'
      });
      
      // Tạo JWT token
      const token = jwt.sign(
        { 
          user_id: newUser.user_id, 
          email: newUser.email,
          role: newUser.role 
        },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        message: 'Đăng ký thành công',
        token: token,
        user: {
          user_id: newUser.user_id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          role: newUser.role
        }
      });
      
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      res.status(500).json({ 
        error: 'Lỗi server',
        details: error.message 
      });
    }
  }
};

module.exports = authController;
