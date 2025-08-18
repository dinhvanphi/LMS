const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const { verifyToken, isTeacher } = require('../middleware/auth');

// Protected routes (require authentication)
// Create a new assignment
router.post('/', verifyToken, isTeacher, assignmentController.create);

// Retrieve all assignments (optionally filter by courseId)
router.get('/', verifyToken, assignmentController.findAll);

// Retrieve a single assignment by id
router.get('/:id', verifyToken, assignmentController.findOne);

// Update an assignment by id
router.put('/:id', verifyToken, isTeacher, assignmentController.update);

// Delete an assignment by id
router.delete('/:id', verifyToken, isTeacher, assignmentController.delete);

// Change assignment status
router.put('/:id/status', verifyToken, isTeacher, assignmentController.changeStatus);

// Get all submissions for an assignment
router.get('/:id/submissions', verifyToken, isTeacher, assignmentController.getSubmissions);

module.exports = router;
