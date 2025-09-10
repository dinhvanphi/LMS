const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  course_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  instructor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
  },
  end_date: {
    type: DataTypes.DATE,
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  enrollment_code: {
    type: DataTypes.STRING(20),
    unique: true,
  },
}, {
  tableName: 'courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Course;