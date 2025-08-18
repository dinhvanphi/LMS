const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Teacher = db.Teacher;

// Create and Save a new Teacher
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Name, email and password cannot be empty!"
      });
    }

    // Check if email already exists
    const existingTeacher = await Teacher.findOne({
      where: { email: req.body.email }
    });

    if (existingTeacher) {
      return res.status(400).send({
        message: "Email already in use."
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a Teacher object
    const teacher = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      subject: req.body.subject,
      bio: req.body.bio
    };

    // Save Teacher in the database
    const data = await Teacher.create(teacher);
    
    // Return success response without password
    const { password, ...teacherWithoutPassword } = data.toJSON();
    res.status(201).send(teacherWithoutPassword);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Teacher account."
    });
  }
};

// Login teacher
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required!"
      });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({
      where: { email }
    });

    if (!teacher) {
      return res.status(404).send({
        message: "Teacher not found with the provided email."
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, teacher.password);
    if (!validPassword) {
      return res.status(401).send({
        message: "Invalid password!"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return teacher data and token
    const { password: pwd, ...teacherWithoutPassword } = teacher.toJSON();
    res.status(200).send({
      ...teacherWithoutPassword,
      token
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred during login."
    });
  }
};

// Retrieve all Teachers
exports.findAll = async (req, res) => {
  try {
    const data = await Teacher.findAll({
      attributes: { exclude: ['password'] }
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving teachers."
    });
  }
};

// Find a single Teacher with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Teacher.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!data) {
      return res.status(404).send({
        message: `Teacher not found with id=${id}.`
      });
    }
    
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving Teacher with id=${req.params.id}`
    });
  }
};

// Update a Teacher by the id
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    
    // If password is being updated, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const num = await Teacher.update(req.body, {
      where: { id: id }
    });
    
    if (num == 1) {
      // Get updated teacher without password
      const updatedTeacher = await Teacher.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      
      res.send({
        message: "Teacher was updated successfully.",
        data: updatedTeacher
      });
    } else {
      res.send({
        message: `Cannot update Teacher with id=${id}. Maybe Teacher was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Teacher with id=${req.params.id}`
    });
  }
};

// Delete a Teacher with the specified id
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Teacher.destroy({
      where: { id: id }
    });
    
    if (num == 1) {
      res.send({
        message: "Teacher was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Teacher with id=${id}. Maybe Teacher was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Could not delete Teacher with id=${req.params.id}`
    });
  }
};
