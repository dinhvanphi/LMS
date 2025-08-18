const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const { verifyToken, isTeacher } = require('../middleware/auth');

// Register new teacher
router.post('/', teacherController.create);

// Login teacher
router.post('/login', teacherController.login);

// Protected routes (require authentication)
router.get('/', verifyToken, isTeacher, teacherController.findAll);
router.get('/:id', verifyToken, isTeacher, teacherController.findOne);
router.put('/:id', verifyToken, isTeacher, teacherController.update);
router.delete('/:id', verifyToken, isTeacher, teacherController.delete);

module.exports = router;
