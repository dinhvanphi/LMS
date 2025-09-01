const express = require('express');
const CourseController = require('../controllers/courseController');
const router = express.Router();

// Tạo khóa học mới
router.post('/create', CourseController.createCourse);

// Lấy danh sách khóa học theo giảng viên
router.get('/instructor/:instructor_id', CourseController.getCoursesByInstructor);

// Lấy thông tin khóa học theo ID
router.get('/:course_id', CourseController.getCourseById);

// Cập nhật khóa học
router.put('/:course_id', CourseController.updateCourse);

// Xóa khóa học
router.delete('/:course_id', CourseController.deleteCourse);

// Lấy thống kê khóa học của giảng viên
router.get('/instructor/:instructor_id/stats', CourseController.getInstructorStats);

module.exports = router;
