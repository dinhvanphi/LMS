require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db.config');
const authRoutes = require('./routes/authRoute');

const app = express();
const PORT = process.env.PORT || 5002;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Edvora LMS Teacher API đang hoạt động!',
    endpoints: {
      sendOTP: 'POST /api/auth/send-otp',
      verifyOTP: 'POST /api/auth/verify-otp',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login'
    }
  });
});

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✓ Kết nối database thành công!');
    
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: true });
      console.log('✓ Database synced (force rebuild)');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Edvora API đang chạy trên http://0.0.0.0:${PORT}`);
      console.log(`📧 API Send OTP: POST http://172.25.12.230:${PORT}/api/auth/send-otp`);
      console.log(`🔐 API Verify OTP: POST http://172.25.12.230:${PORT}/api/auth/verify-otp`);
      console.log(`📝 API Register: POST http://172.25.12.230:${PORT}/api/auth/register`);
      console.log(`🔑 API Login: POST http://172.25.12.230:${PORT}/api/auth/login`);
    });
  } catch (error) {
    console.error('❌ Không thể kết nối database:', error);
  }
}

startServer();