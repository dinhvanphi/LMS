const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// API đăng ký instructor
router.post('/register', authController.register);

module.exports = router;
