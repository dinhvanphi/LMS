const express = require('express');
const { createCourse } = require('../controllers/courseController');
const { validateCreateCourse } = require('../middlewares/courseValidation');

const router = express.Router();

// POST /api/courses - Tạo khóa học mới
router.post('/', validateCreateCourse, createCourse);

module.exports = router;