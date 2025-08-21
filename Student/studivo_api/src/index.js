require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const studentRoutes = require('./routes/student.routes');
const courseRoutes = require('./routes/course.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const submissionRoutes = require('./routes/submission.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Studivo LMS API' });
});

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true });
      console.log('Database synced (force rebuild)');
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
