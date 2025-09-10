const { body } = require('express-validator');

const validateCreateCourse = [
  body('title')
    .notEmpty()
    .withMessage('Tiêu đề khóa học là bắt buộc')
    .isLength({ min: 5, max: 255 })
    .withMessage('Tiêu đề phải từ 5-255 ký tự'),

  body('description')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Mô tả không được quá 5000 ký tự'),

  body('short_description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Mô tả ngắn không được quá 500 ký tự'),

  body('instructor_id')
    .optional()
    .isUUID()
    .withMessage('ID giảng viên phải là UUID hợp lệ'),

  body('category_id')
    .optional()
    .isUUID()
    .withMessage('ID danh mục phải là UUID hợp lệ'),

  body('thumbnail_url')
    .optional()
    .isURL()
    .withMessage('URL thumbnail không hợp lệ'),

  body('price')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Giá phải là số thập phân hợp lệ')
    .custom(value => {
      if (value < 0) {
        throw new Error('Giá không được âm');
      }
      return true;
    }),

  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level phải là beginner, intermediate hoặc advanced'),

  body('duration_hours')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Thời lượng phải là số nguyên dương'),

  body('max_students')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Số học viên tối đa phải là số nguyên dương'),

  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('is_published phải là boolean'),

  body('enrollment_start')
    .optional()
    .isISO8601()
    .withMessage('Ngày bắt đầu đăng ký phải là ISO8601 date'),

  body('enrollment_end')
    .optional()
    .isISO8601()
    .withMessage('Ngày kết thúc đăng ký phải là ISO8601 date'),

  body('course_start')
    .optional()
    .isISO8601()
    .withMessage('Ngày bắt đầu khóa học phải là ISO8601 date'),

  body('course_end')
    .optional()
    .isISO8601()
    .withMessage('Ngày kết thúc khóa học phải là ISO8601 date')
];

module.exports = {
  validateCreateCourse
};