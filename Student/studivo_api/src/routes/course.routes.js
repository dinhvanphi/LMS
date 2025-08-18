const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isStudent } = require('../middleware/auth');

// All routes require student authentication
router.use(verifyToken, isStudent);

// Get all courses student is enrolled in
router.get('/enrolled', courseController.getEnrolledCourses);

// Get a specific enrolled course details
router.get('/enrolled/:id', courseController.getEnrolledCourseById);

// Enroll in a course using course code
router.post('/enroll', courseController.enrollWithCode);

// Unenroll from a course
router.put('/enrolled/:id/unenroll', courseController.unenroll);

// Get available courses (courses student is not enrolled in)
router.get('/available', courseController.getAvailableCourses);

module.exports = router;
