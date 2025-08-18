const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    courseCode: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
      defaultValue: () => {
        // Generate a random 6-character alphanumeric code
        const alphanumeric = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
        }
        return code;
      }
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'draft', 'completed', 'archived'),
      defaultValue: 'draft'
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    tableName: 'courses'
  });

  return Course;
};
