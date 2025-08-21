require('dotenv').config();
const express = require('express');
const { sequelize } = require('./config/db.config');
const authRoutes = require('./routes/authRoute');

const app = express();
const PORT = process.env.PORT || 5001;

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