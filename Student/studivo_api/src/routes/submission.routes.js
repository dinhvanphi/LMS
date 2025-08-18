const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const { verifyToken, isStudent } = require('../middleware/auth');

// All routes require student authentication
router.use(verifyToken, isStudent);

// Submit an assignment
router.post('/:assignmentId', submissionController.submitAssignment);

// Get a student's submission for an assignment
router.get('/:assignmentId', submissionController.getSubmission);

// Get all submissions for a student
router.get('/', submissionController.getAllSubmissions);

module.exports = router;
