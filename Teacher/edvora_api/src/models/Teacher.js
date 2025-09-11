
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Teacher = sequelize.define('Teacher', {
  teacher_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  employee_id: {
    type: DataTypes.STRING(20),
    unique: true,
  },
  department: {
    type: DataTypes.STRING(100),
  },
  specialization: {
    type: DataTypes.STRING(255),
  },
  qualification: {
    type: DataTypes.STRING(255),
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  office_location: {
    type: DataTypes.STRING(100),
  },
  phone_extension: {
    type: DataTypes.STRING(10),
  },
  bio: {
    type: DataTypes.TEXT,
  },
  research_interests: {
    type: DataTypes.TEXT,
  },
  office_hours: {
    type: DataTypes.STRING(255),
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  hire_date: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'teachers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Teacher;