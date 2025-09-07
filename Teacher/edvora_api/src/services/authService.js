const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db.config');
const User = require('../models/userModel');
const Teacher = require('../models/Teacher');
const Student = require('../models/StudentModel');

exports.register = async (data) => {
  const { email, password, first_name, last_name, phone, avatar_url } = data;

  // Bắt đầu transaction để đảm bảo tính nhất quán dữ liệu
  const transaction = await sequelize.transaction();

  try {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email đã tồn tại');
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới trong bảng users
    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      phone,
      avatar_url: avatar_url || null,
      role: 'instructor', // mặc định cho teacher app
      is_active: true
    }, { transaction });

    // Tự động tạo record trong bảng teachers hoặc students dựa trên role
    let roleSpecificData = null;
    
    if (newUser.role === 'instructor') {
      // Tạo record trong bảng teachers
      roleSpecificData = await Teacher.create({
        user_id: newUser.user_id,
        is_active: true,
        hire_date: new Date()
      }, { transaction });
    } else if (newUser.role === 'student') {
      // Tạo record trong bảng students  
      roleSpecificData = await Student.create({
        user_id: newUser.user_id,
        enrollment_year: new Date().getFullYear(),
        status: 'active'
      }, { transaction });
    }

    // Commit transaction nếu tất cả thành công
    await transaction.commit();

    // Trả về thông tin cần thiết
    return {
      id: newUser.user_id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      phone: newUser.phone,
      avatar_url: newUser.avatar_url,
      role: newUser.role,
      is_active: newUser.is_active,
      role_specific_id: roleSpecificData ? 
        (newUser.role === 'instructor' ? roleSpecificData.teacher_id : roleSpecificData.student_id) 
        : null
    };

  } catch (error) {
    // Rollback transaction nếu có lỗi
    await transaction.rollback();
    throw error;
  }
};
