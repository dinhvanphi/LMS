const Course = require('../models/Course');
const { validationResult } = require('express-validator');

const createCourse = async (req, res) => {
  try {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      short_description,
      instructor_id,
      category_id,
      thumbnail_url,
      price,
      level,
      duration_hours,
      max_students,
      is_published,
      enrollment_start,
      enrollment_end,
      course_start,
      course_end
    } = req.body;

    // Tạo khóa học mới
    const newCourse = await Course.create({
      title,
      description,
      short_description,
      instructor_id,
      category_id,
      thumbnail_url,
      price: price || 0,
      level,
      duration_hours,
      max_students,
      is_published: is_published || false,
      enrollment_start: enrollment_start ? new Date(enrollment_start) : null,
      enrollment_end: enrollment_end ? new Date(enrollment_end) : null,
      course_start: course_start ? new Date(course_start) : null,
      course_end: course_end ? new Date(course_end) : null
    });

    res.status(201).json({
      success: true,
      message: 'Tạo khóa học thành công',
      data: newCourse
    });

  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo khóa học',
      error: error.message
    });
  }
};

module.exports = {
  createCourse
};