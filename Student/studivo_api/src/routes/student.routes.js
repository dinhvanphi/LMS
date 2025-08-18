const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { verifyToken, isStudent } = require('../middleware/auth');

// Register new student
router.post('/', studentController.create);

// Login student
router.post('/login', studentController.login);

// Protected routes (require authentication)
router.get('/profile', verifyToken, isStudent, studentController.getProfile);
router.put('/profile', verifyToken, isStudent, studentController.updateProfile);
router.put('/change-password', verifyToken, isStudent, studentController.changePassword);

module.exports = router;
