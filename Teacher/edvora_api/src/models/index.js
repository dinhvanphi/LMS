const { Sequelize } = require('sequelize');
const config = require('../config/db.config.js')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    operatorsAliases: 0,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },
    logging: config.logging,
    ...(config.dialectOptions && { dialectOptions: config.dialectOptions })
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Teacher = require('./teacher.model')(sequelize, Sequelize);
db.Student = require('./student.model')(sequelize, Sequelize);
db.Course = require('./course.model')(sequelize, Sequelize);
db.Assignment = require('./assignment.model')(sequelize, Sequelize);
db.Enrollment = require('./enrollment.model')(sequelize, Sequelize);
db.Submission = require('./submission.model')(sequelize, Sequelize);

// Define relationships
// Teacher - Course (1:Many)
db.Teacher.hasMany(db.Course, { foreignKey: 'teacherId' });
db.Course.belongsTo(db.Teacher, { foreignKey: 'teacherId' });

// Course - Assignment (1:Many)
db.Course.hasMany(db.Assignment, { foreignKey: 'courseId' });
db.Assignment.belongsTo(db.Course, { foreignKey: 'courseId' });

// Student - Course (Many:Many) through Enrollment
db.Student.belongsToMany(db.Course, { through: db.Enrollment, foreignKey: 'studentId' });
db.Course.belongsToMany(db.Student, { through: db.Enrollment, foreignKey: 'courseId' });

// Student - Assignment (1:Many) through Submission
db.Student.hasMany(db.Submission, { foreignKey: 'studentId' });
db.Submission.belongsTo(db.Student, { foreignKey: 'studentId' });

db.Assignment.hasMany(db.Submission, { foreignKey: 'assignmentId' });
db.Submission.belongsTo(db.Assignment, { foreignKey: 'assignmentId' });

module.exports = db;
