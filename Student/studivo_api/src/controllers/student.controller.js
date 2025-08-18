const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Student = db.Student;

// Create and Save a new Student
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Name, email and password cannot be empty!"
      });
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({
      where: { email: req.body.email }
    });

    if (existingStudent) {
      return res.status(400).send({
        message: "Email already in use."
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a Student object
    const student = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      grade: req.body.grade,
      dateOfBirth: req.body.dateOfBirth
    };

    // Save Student in the database
    const data = await Student.create(student);
    
    // Return success response without password
    const { password, ...studentWithoutPassword } = data.toJSON();
    res.status(201).send(studentWithoutPassword);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Student account."
    });
  }
};

// Login student
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required!"
      });
    }

    // Find student by email
    const student = await Student.findOne({
      where: { email }
    });

    if (!student) {
      return res.status(404).send({
        message: "Student not found with the provided email."
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword) {
      return res.status(401).send({
        message: "Invalid password!"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student.id, email: student.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return student data and token
    const { password: pwd, ...studentWithoutPassword } = student.toJSON();
    res.status(200).send({
      ...studentWithoutPassword,
      token
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred during login."
    });
  }
};

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!student) {
      return res.status(404).send({
        message: "Student not found."
      });
    }
    
    res.send(student);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving student profile."
    });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    // Prevent updating role or other sensitive fields
    const allowedUpdates = ['name', 'phone', 'profileImage', 'grade', 'dateOfBirth'];
    const updates = {};
    
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    
    const num = await Student.update(updates, {
      where: { id: req.user.id }
    });
    
    if (num == 1) {
      const updatedStudent = await Student.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      
      res.send({
        message: "Profile updated successfully.",
        data: updatedStudent
      });
    } else {
      res.send({
        message: "Could not update profile. Please try again."
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while updating profile."
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).send({
        message: "Current password and new password are required!"
      });
    }
    
    const student = await Student.findByPk(req.user.id);
    
    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, student.password);
    if (!validPassword) {
      return res.status(401).send({
        message: "Current password is incorrect!"
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await Student.update({ password: hashedPassword }, {
      where: { id: req.user.id }
    });
    
    res.send({
      message: "Password changed successfully."
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while changing password."
    });
  }
};
