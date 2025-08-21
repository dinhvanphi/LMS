const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// API đăng ký student
router.post('/register', authController.register);

module.exports = router;
