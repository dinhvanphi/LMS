require('dotenv').config();
const express = require('express');
const { sequelize } = require('./config/db.config');
const authRoutes = require('./routes/authRoute');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Gmail của bạn
    pass: process.env.EMAIL_APP_PASSWORD // App Password từ Gmail
  }
});

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test database connection và sync
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✓ Kết nối database thành công!');
    
    await sequelize.sync();
    console.log('✓ Database sync thành công!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy trên http://localhost:${PORT}`);
      console.log(`📝 API Register: POST http://localhost:${PORT}/api/auth/register`);
    });
    
  } catch (error) {
    console.error('❌ Không thể kết nối database:', error);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Student API đang hoạt động!',
    endpoints: {
      register: 'POST /api/auth/register'
    }
  });
});

startServer();