const db = require('../models');
const Submission = db.Submission;
const Assignment = db.Assignment;
const Course = db.Course;
const Enrollment = db.Enrollment;

// Submit an assignment
exports.submitAssignment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const assignmentId = req.params.assignmentId;
    
    // Validate request
    if (!req.body.content && (!req.body.attachments || req.body.attachments.length === 0)) {
      return res.status(400).send({
        message: "Submission must include content or attachments!"
      });
    }
    
    // Check if assignment exists and is published
    const assignment = await Assignment.findOne({
      where: {
        id: assignmentId,
        status: 'published'
      },
      include: [Course]
    });
    
    if (!assignment) {
      return res.status(404).send({
        message: "Assignment not found or not available for submission."
      });
    }
    
    // Check if student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      where: { 
        studentId,
        courseId: assignment.courseId,
        status: 'active'
      }
    });
    
    if (!enrollment) {
      return res.status(403).send({
        message: "You are not actively enrolled in this course."
      });
    }
    
    // Check if assignment is past due date
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isLate = now > dueDate;
    
    // Check if student has already submitted
    const existingSubmission = await Submission.findOne({
      where: {
        studentId,
        assignmentId
      }
    });
    
    let submission;
    
    if (existingSubmission) {
      // Update existing submission
      submission = await Submission.update({
        content: req.body.content,
        attachments: req.body.attachments || [],
        submissionDate: now,
        status: isLate ? 'late' : 'resubmitted'
      }, {
        where: {
          studentId,
          assignmentId
        },
        returning: true
      });
      
      submission = submission[1][0]; // Get updated instance
    } else {
      // Create new submission
      submission = await Submission.create({
        studentId,
        assignmentId,
        content: req.body.content,
        attachments: req.body.attachments || [],
        submissionDate: now,
        status: isLate ? 'late' : 'submitted'
      });
    }
    
    res.status(201).send({
      message: existingSubmission ? "Assignment resubmitted successfully." : "Assignment submitted successfully.",
      data: submission,
      isLate
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while submitting assignment."
    });
  }
};

// Get a student's submission for an assignment
exports.getSubmission = async (req, res) => {
  try {
    const studentId = req.user.id;
    const assignmentId = req.params.assignmentId;
    
    // Check if assignment exists
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).send({
        message: "Assignment not found."
      });
    }
    
    // Get submission
    const submission = await Submission.findOne({
      where: {
        studentId,
        assignmentId
      }
    });
    
    if (!submission) {
      return res.status(404).send({
        message: "Submission not found. You haven't submitted this assignment yet."
      });
    }
    
    res.send(submission);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving submission."
    });
  }
};

// Get all submissions for a student
exports.getAllSubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const submissions = await Submission.findAll({
      where: { studentId },
      include: [{
        model: Assignment,
        include: [Course]
      }],
      order: [['submissionDate', 'DESC']]
    });
    
    res.send(submissions);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving submissions."
    });
  }
};
