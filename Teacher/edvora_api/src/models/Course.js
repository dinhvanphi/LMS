const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  short_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  instructor_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  thumbnail_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  level: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: [['beginner', 'intermediate', 'advanced']]
    }
  },
  duration_hours: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  max_students: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  enrollment_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  enrollment_end: {
    type: DataTypes.DATE,
    allowNull: true
  },
  course_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  course_end: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = Course;