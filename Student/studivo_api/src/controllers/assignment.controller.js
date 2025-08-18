const db = require('../models');
const Assignment = db.Assignment;
const Course = db.Course;
const Enrollment = db.Enrollment;
const Submission = db.Submission;

// Get assignments for a specific course
exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courseId = req.params.courseId;
    
    // Check if student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      where: { 
        studentId,
        courseId,
        status: 'active'
      }
    });
    
    if (!enrollment) {
      return res.status(403).send({
        message: "You are not actively enrolled in this course."
      });
    }
    
    // Get published assignments for the course
    const assignments = await Assignment.findAll({
      where: {
        courseId,
        status: 'published'
      },
      order: [['dueDate', 'ASC']]
    });
    
    // Get student's submissions for these assignments
    const assignmentIds = assignments.map(a => a.id);
    const submissions = await Submission.findAll({
      where: {
        studentId,
        assignmentId: assignmentIds
      }
    });
    
    // Map submissions to assignments
    const submissionMap = {};
    submissions.forEach(sub => {
      submissionMap[sub.assignmentId] = sub;
    });
    
    // Add submission status to each assignment
    const assignmentsWithSubmission = assignments.map(assignment => {
      const assignmentJson = assignment.toJSON();
      
      if (submissionMap[assignment.id]) {
        assignmentJson.submission = {
          id: submissionMap[assignment.id].id,
          status: submissionMap[assignment.id].status,
          grade: submissionMap[assignment.id].grade,
          submissionDate: submissionMap[assignment.id].submissionDate
        };
      } else {
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        
        assignmentJson.submission = {
          status: now > dueDate ? 'overdue' : 'not_submitted'
        };
      }
      
      return assignmentJson;
    });
    
    res.send(assignmentsWithSubmission);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving assignments."
    });
  }
};

// Get details of a specific assignment
exports.getAssignmentById = async (req, res) => {
  try {
    const studentId = req.user.id;
    const assignmentId = req.params.id;
    
    // Get assignment with course info
    const assignment = await Assignment.findByPk(assignmentId, {
      include: [{
        model: Course,
        attributes: ['id', 'title', 'teacherId']
      }]
    });
    
    if (!assignment) {
      return res.status(404).send({
        message: "Assignment not found."
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
    
    // Check if assignment is published
    if (assignment.status !== 'published') {
      return res.status(403).send({
        message: "This assignment is not yet available."
      });
    }
    
    // Get student's submission for this assignment
    const submission = await Submission.findOne({
      where: {
        studentId,
        assignmentId
      }
    });
    
    const assignmentWithSubmission = assignment.toJSON();
    
    if (submission) {
      assignmentWithSubmission.submission = submission;
    } else {
      const now = new Date();
      const dueDate = new Date(assignment.dueDate);
      
      assignmentWithSubmission.submission = {
        status: now > dueDate ? 'overdue' : 'not_submitted'
      };
    }
    
    res.send(assignmentWithSubmission);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving assignment details."
    });
  }
};
