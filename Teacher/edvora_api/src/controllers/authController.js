const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Teacher = require('../models/teacherModel');
const otpService = require('../services/otpService');

const authController = {
  // API gửi OTP cho giáo viên
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
        message: 'OTP đã được gửi đến email của Thầy/Cô',
        email: email,
        expireTime: result.expireTime
      });
      
    } catch (error) {
      console.error('Lỗi gửi OTP:', error);
      res.status(500).json({ error: 'Không thể gửi OTP' });
    }
  },

  // API xác thực OTP cho giáo viên
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

  // API đăng ký giáo viên
  register: async (req, res) => {
    try {
      const { 
        email, 
        password, 
        first_name, 
        last_name, 
        phone, 
        bio, 
        qualifications, 
        experience_years, 
        expertise 
      } = req.body;
      
      // Kiểm tra email đã tồn tại
      const existingTeacher = await Teacher.findOne({ where: { email } });
      if (existingTeacher) {
        return res.status(400).json({ error: 'Email đã được sử dụng' });
      }
      
      // Hash password
      const password_hash = await bcrypt.hash(password, 10);
      
      // Tạo giáo viên mới
      const newTeacher = await Teacher.create({
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        bio,
        qualifications,
        experience_years: experience_years || 0,
        expertise
      });
      
      res.status(201).json({
        message: 'Đăng ký tài khoản giáo viên thành công',
        teacher: {
          teacher_id: newTeacher.teacher_id,
          email: newTeacher.email,
          first_name: newTeacher.first_name,
          last_name: newTeacher.last_name,
          experience_years: newTeacher.experience_years,
          is_verified: newTeacher.is_verified
        }
      });
      
    } catch (error) {
      console.error('Lỗi đăng ký giáo viên:', error);
      res.status(500).json({ error: 'Lỗi server' });
    }
  }
};

module.exports = authController;
