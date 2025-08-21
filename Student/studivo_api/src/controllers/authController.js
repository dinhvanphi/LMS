const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, first_name, last_name, phone } = req.body;
      
      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email đã được sử dụng' });
      }
      
      // Hash password
      const password_hash = await bcrypt.hash(password, 10);
      
      // Tạo user mới
      const newUser = await User.create({
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        role: 'student'
      });
      
      res.status(201).json({
        message: 'Đăng ký thành công',
        user: {
          user_id: newUser.user_id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name
        }
      });
      
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      res.status(500).json({ error: 'Lỗi server' });
    }
  }
};

module.exports = authController;
