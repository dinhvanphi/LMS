const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.register = async (data) => {
  const { email, password, first_name, last_name, phone, avatar_url } = data;

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email đã tồn tại');
  }

  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Lưu user mới vào DB
  const newUser = await User.create({
    email,
    password_hash: hashedPassword,
    first_name,
    last_name,
    phone,
    avatar_url: avatar_url || null,
    role: 'instructor', // mặc định
    is_active: true
  });

  // Trả về thông tin cần thiết
  return {
    id: newUser.user_id,
    email: newUser.email,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    phone: newUser.phone,
    avatar_url: newUser.avatar_url,
    role: newUser.role,
    is_active: newUser.is_active
  };
};
