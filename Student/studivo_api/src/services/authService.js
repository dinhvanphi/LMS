const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
    role: 'student', // mặc định
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

exports.login = async (email, password) => {
  // Tìm user theo email
  const user = await User.findOne({ 
    where: { email },
    attributes: ['user_id', 'email', 'password_hash', 'first_name', 'last_name', 'phone', 'avatar_url', 'role', 'is_active']
  });

  if (!user) {
    throw new Error('Email không tồn tại');
  }

  // Kiểm tra tài khoản có được kích hoạt không
  if (!user.is_active) {
    throw new Error('Tài khoản chưa được kích hoạt');
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Mật khẩu không chính xác');
  }

  // Tạo JWT token
  const token = jwt.sign(
    {
      userId: user.user_id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'studivo_secret_key',
    { expiresIn: '24h' }
  );

  // Trả về thông tin user và token (không bao gồm password)
  return {
    token,
    user: {
      id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      fullName: `${user.first_name} ${user.last_name}`,
      phone: user.phone,
      avatar_url: user.avatar_url,
      role: user.role,
      is_active: user.is_active
    }
  };
};
