const db = require('../models');
const Course = db.Course;
const Teacher = db.Teacher;
const Student = db.Student;
const Enrollment = db.Enrollment;

// Create and Save a new Course
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.title || !req.body.teacherId) {
      return res.status(400).send({
        message: "Course title and teacher ID cannot be empty!"
      });
    }

    // Create a Course
    const course = {
      title: req.body.title,
      description: req.body.description,
      coverImage: req.body.coverImage,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status || 'draft',
      teacherId: req.body.teacherId
    };

    // Save Course in the database
    const data = await Course.create(course);
    
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Course."
    });
  }
};

// Retrieve all Courses
exports.findAll = async (req, res) => {
  try {
    const teacherId = req.query.teacherId;
    const condition = teacherId ? { teacherId: teacherId } : null;

    const data = await Course.findAll({
      where: condition,
      include: [{
        model: Teacher,
        attributes: ['id', 'name', 'email', 'subject']
      }]
    });
    
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving courses."
    });
  }
};

// Find a single Course with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    
    const data = await Course.findByPk(id, {
      include: [{
        model: Teacher,
        attributes: ['id', 'name', 'email', 'subject']
      }]
    });
    
    if (!data) {
      return res.status(404).send({
        message: `Course not found with id=${id}.`
      });
    }
    
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving Course with id=${req.params.id}`
    });
  }
};

// Update a Course by the id
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    
    const num = await Course.update(req.body, {
      where: { id: id }
    });
    
    if (num == 1) {
      const updatedCourse = await Course.findByPk(id);
      res.send({
        message: "Course was updated successfully.",
        data: updatedCourse
      });
    } else {
      res.send({
        message: `Cannot update Course with id=${id}. Maybe Course was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Course with id=${req.params.id}`
    });
  }
};

// Delete a Course with the specified id
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    
    const num = await Course.destroy({
      where: { id: id }
    });
    
    if (num == 1) {
      res.send({
        message: "Course was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Course with id=${id}. Maybe Course was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Could not delete Course with id=${req.params.id}`
    });
  }
};

// Generate new course code
exports.generateNewCode = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Generate a new course code
    const alphanumeric = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let courseCode = '';
    for (let i = 0; i < 6; i++) {
      courseCode += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    
    // Update the course with new code
    const num = await Course.update({ courseCode }, {
      where: { id: id }
    });
    
    if (num == 1) {
      const updatedCourse = await Course.findByPk(id);
      res.send({
        message: "Course code was regenerated successfully.",
        data: updatedCourse
      });
    } else {
      res.send({
        message: `Cannot update Course with id=${id}. Maybe Course was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error regenerating course code for Course with id=${req.params.id}`
    });
  }
};

// Enroll student to course by code
exports.enrollByCode = async (req, res) => {
  try {
    const { courseCode, studentId } = req.body;
    
    if (!courseCode || !studentId) {
      return res.status(400).send({
        message: "Course code and student ID are required!"
      });
    }
    
    // Find course by code
    const course = await Course.findOne({
      where: { courseCode }
    });
    
    if (!course) {
      return res.status(404).send({
        message: "Invalid course code. Course not found."
      });
    }
    
    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).send({
        message: `Student not found with id=${studentId}.`
      });
    }
    
    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        studentId,
        courseId: course.id
      }
    });
    
    if (existingEnrollment) {
      return res.status(400).send({
        message: "Student is already enrolled in this course."
      });
    }
    
    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId,
      courseId: course.id,
      status: 'active',
      enrollmentDate: new Date()
    });
    
    res.status(201).send({
      message: "Student enrolled successfully.",
      data: {
        enrollment,
        course: {
          id: course.id,
          title: course.title
        }
      }
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while enrolling student to course."
    });
  }
};

// Get all students enrolled in a course
exports.getEnrolledStudents = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [{
        model: Student,
        attributes: ['id', 'name', 'email', 'grade']
      }]
    });
    
    res.send(enrollments);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving enrolled students."
    });
  }
};
