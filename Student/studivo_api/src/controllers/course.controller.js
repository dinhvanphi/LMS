const db = require('../models');
const Course = db.Course;
const Teacher = db.Teacher;
const Enrollment = db.Enrollment;
const Assignment = db.Assignment;
const { Op } = db.Sequelize;

// Get all courses that student is enrolled in
exports.getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const enrollments = await Enrollment.findAll({
      where: { studentId },
      include: [{
        model: Course,
        include: [{
          model: Teacher,
          attributes: ['id', 'name', 'subject']
        }]
      }]
    });
    
    const courses = enrollments.map(enrollment => {
      const course = enrollment.Course.toJSON();
      return {
        ...course,
        enrollment: {
          status: enrollment.status,
          progress: enrollment.progress,
          enrollmentDate: enrollment.enrollmentDate
        }
      };
    });
    
    res.send(courses);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving enrolled courses."
    });
  }
};

// Get a single course detail that student is enrolled in
exports.getEnrolledCourseById = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.id;
    
    // Check if student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      where: { 
        studentId,
        courseId
      }
    });
    
    if (!enrollment) {
      return res.status(403).send({
        message: "You are not enrolled in this course."
      });
    }
    
    // Get course details
    const course = await Course.findByPk(courseId, {
      include: [{
        model: Teacher,
        attributes: ['id', 'name', 'subject', 'email']
      }, {
        model: Assignment,
        where: { status: 'published' },
        required: false
      }]
    });
    
    if (!course) {
      return res.status(404).send({
        message: "Course not found."
      });
    }
    
    const courseWithEnrollment = {
      ...course.toJSON(),
      enrollment: {
        status: enrollment.status,
        progress: enrollment.progress,
        enrollmentDate: enrollment.enrollmentDate
      }
    };
    
    res.send(courseWithEnrollment);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving course details."
    });
  }
};

// Enroll in a course using course code
exports.enrollWithCode = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseCode } = req.body;
    
    if (!courseCode) {
      return res.status(400).send({
        message: "Course code is required!"
      });
    }
    
    // Find course by code
    const course = await Course.findOne({
      where: { 
        courseCode,
        status: 'active' 
      }
    });
    
    if (!course) {
      return res.status(404).send({
        message: "Invalid course code or course is not active."
      });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        studentId,
        courseId: course.id
      }
    });
    
    if (existingEnrollment) {
      return res.status(400).send({
        message: "You are already enrolled in this course."
      });
    }
    
    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId,
      courseId: course.id,
      enrollmentDate: new Date(),
      status: 'active'
    });
    
    res.status(201).send({
      message: "Successfully enrolled in the course.",
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
      message: err.message || "Some error occurred while enrolling in course."
    });
  }
};

// Unenroll from a course
exports.unenroll = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.id;
    
    // Check if student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      where: { 
        studentId,
        courseId
      }
    });
    
    if (!enrollment) {
      return res.status(404).send({
        message: "You are not enrolled in this course."
      });
    }
    
    // Update enrollment status to 'dropped'
    await Enrollment.update({ status: 'dropped' }, {
      where: {
        studentId,
        courseId
      }
    });
    
    res.send({
      message: "Successfully unenrolled from the course."
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while unenrolling from course."
    });
  }
};

// Get available courses (courses student is not enrolled in)
exports.getAvailableCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get IDs of courses the student is already enrolled in
    const enrollments = await Enrollment.findAll({
      where: { studentId },
      attributes: ['courseId']
    });
    
    const enrolledCourseIds = enrollments.map(e => e.courseId);
    
    // Find active courses student is not enrolled in
    const availableCourses = await Course.findAll({
      where: {
        status: 'active',
        id: {
          [Op.notIn]: enrolledCourseIds
        }
      },
      include: [{
        model: Teacher,
        attributes: ['id', 'name', 'subject']
      }],
      attributes: { exclude: ['courseCode'] } // Don't expose course codes
    });
    
    res.send(availableCourses);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving available courses."
    });
  }
};
