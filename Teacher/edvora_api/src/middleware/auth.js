const jwt = require('jsonwebtoken');
const db = require('../models');
const Teacher = db.Teacher;
const Student = db.Student;

// Verify JWT Token
exports.verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).send({
      message: "A token is required for authentication"
    });
  }
  
  try {
    // Remove 'Bearer ' if present
    const finalToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      message: "Invalid Token"
    });
  }
};

// Check if user is Teacher
exports.isTeacher = async (req, res, next) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).send({
        message: "Require Teacher Role!"
      });
    }
    
    const teacher = await Teacher.findByPk(req.user.id);
    if (!teacher) {
      return res.status(403).send({
        message: "Teacher not found!"
      });
    }
    
    next();
  } catch (err) {
    return res.status(500).send({
      message: "Unable to validate Teacher role!"
    });
  }
};

// Check if user is Student
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).send({
        message: "Require Student Role!"
      });
    }
    
    const student = await Student.findByPk(req.user.id);
    if (!student) {
      return res.status(403).send({
        message: "Student not found!"
      });
    }
    
    next();
  } catch (err) {
    return res.status(500).send({
      message: "Unable to validate Student role!"
    });
  }
};
