const db = require('../models');
const Assignment = db.Assignment;
const Course = db.Course;
const Submission = db.Submission;

// Create and Save a new Assignment
exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.title || !req.body.courseId || !req.body.dueDate) {
      return res.status(400).send({
        message: "Title, course ID and due date cannot be empty!"
      });
    }

    // Create an Assignment
    const assignment = {
      title: req.body.title,
      description: req.body.description,
      dueDate: new Date(req.body.dueDate),
      totalPoints: req.body.totalPoints || 100,
      attachments: req.body.attachments || [],
      status: req.body.status || 'draft',
      courseId: req.body.courseId
    };

    // Save Assignment in the database
    const data = await Assignment.create(assignment);
    
    res.status(201).send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Assignment."
    });
  }
};

// Retrieve all Assignments
exports.findAll = async (req, res) => {
  try {
    const courseId = req.query.courseId;
    const condition = courseId ? { courseId: courseId } : null;

    const data = await Assignment.findAll({
      where: condition,
      include: [{
        model: Course,
        attributes: ['id', 'title']
      }],
      order: [['dueDate', 'ASC']]
    });
    
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving assignments."
    });
  }
};

// Find a single Assignment with an id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    
    const data = await Assignment.findByPk(id, {
      include: [{
        model: Course,
        attributes: ['id', 'title', 'teacherId']
      }]
    });
    
    if (!data) {
      return res.status(404).send({
        message: `Assignment not found with id=${id}.`
      });
    }
    
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: `Error retrieving Assignment with id=${req.params.id}`
    });
  }
};

// Update an Assignment by the id
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    
    if (req.body.dueDate) {
      req.body.dueDate = new Date(req.body.dueDate);
    }
    
    const num = await Assignment.update(req.body, {
      where: { id: id }
    });
    
    if (num == 1) {
      const updatedAssignment = await Assignment.findByPk(id);
      res.send({
        message: "Assignment was updated successfully.",
        data: updatedAssignment
      });
    } else {
      res.send({
        message: `Cannot update Assignment with id=${id}. Maybe Assignment was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating Assignment with id=${req.params.id}`
    });
  }
};

// Delete an Assignment with the specified id
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    
    const num = await Assignment.destroy({
      where: { id: id }
    });
    
    if (num == 1) {
      res.send({
        message: "Assignment was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Assignment with id=${id}. Maybe Assignment was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Could not delete Assignment with id=${req.params.id}`
    });
  }
};

// Change assignment status
exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    
    if (!status || !['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).send({
        message: "Status is required and must be one of: draft, published, archived"
      });
    }
    
    const num = await Assignment.update({ status }, {
      where: { id: id }
    });
    
    if (num == 1) {
      const updatedAssignment = await Assignment.findByPk(id);
      res.send({
        message: `Assignment status changed to ${status} successfully.`,
        data: updatedAssignment
      });
    } else {
      res.send({
        message: `Cannot update Assignment with id=${id}. Maybe Assignment was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Error updating assignment status with id=${req.params.id}`
    });
  }
};

// Get all submissions for an assignment
exports.getSubmissions = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    
    const submissions = await Submission.findAll({
      where: { assignmentId },
      include: [{
        model: db.Student,
        attributes: ['id', 'name', 'email']
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
