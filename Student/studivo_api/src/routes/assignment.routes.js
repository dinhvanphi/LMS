const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const { verifyToken, isStudent } = require('../middleware/auth');

// All routes require student authentication
router.use(verifyToken, isStudent);

// Get assignments for a specific course
router.get('/course/:courseId', assignmentController.getAssignmentsByCourse);

// Get details of a specific assignment
router.get('/:id', assignmentController.getAssignmentById);

module.exports = router;
