const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isTeacher } = require('../middleware/auth');

// Protected routes (require authentication)
// Create a new course
router.post('/', verifyToken, isTeacher, courseController.create);

// Retrieve all courses (optionally filter by teacherId)
router.get('/', verifyToken, courseController.findAll);

// Retrieve a single course by id
router.get('/:id', verifyToken, courseController.findOne);

// Update a course by id
router.put('/:id', verifyToken, isTeacher, courseController.update);

// Delete a course by id
router.delete('/:id', verifyToken, isTeacher, courseController.delete);

// Generate new course code
router.put('/:id/generate-code', verifyToken, isTeacher, courseController.generateNewCode);

// Enroll student by course code
router.post('/enroll-by-code', verifyToken, courseController.enrollByCode);

// Get all students enrolled in a course
router.get('/:courseId/students', verifyToken, isTeacher, courseController.getEnrolledStudents);

module.exports = router;
