const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Store OTP tạm thời (trong production nên dùng Redis)
const otpStore = new Map();

const otpService = {
  // Tạo OTP 6 số
  generateOTP: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Lưu OTP với thời gian hết hạn (5 phút)
  storeOTP: (email, otp) => {
    const expireTime = Date.now() + 5 * 60 * 1000; // 5 phút
    otpStore.set(email, { otp, expireTime });
  },

  // Kiểm tra OTP hợp lệ
  verifyOTP: (email, inputOTP) => {
    const stored = otpStore.get(email);
    if (!stored) return false;
    
    if (Date.now() > stored.expireTime) {
      otpStore.delete(email);
      return false;
    }
    
    return stored.otp === inputOTP;
  },

  // Xóa OTP sau khi xác thực thành công
  clearOTP: (email) => {
    otpStore.delete(email);
  },

  // Gửi OTP qua email
  sendOTP: async (email, firstName = '') => {
    try {
      const otp = otpService.generateOTP();
      
      // Lưu OTP
      otpService.storeOTP(email, otp);
      
      // Template email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🔐 Mã OTP xác thực tài khoản - Edvora LMS',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50;">📚 Edvora LMS</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2c3e50; margin-top: 0;">Xin chào ${firstName}!</h2>
              <p style="font-size: 16px; line-height: 1.5; color: #555;">
                Cảm ơn bạn đã đăng ký tài khoản tại <strong>Edvora LMS</strong>. 
                Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã OTP bên dưới:
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #3498db; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; display: inline-block; letter-spacing: 5px;">
                ${otp}
              </div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                ⚠️ <strong>Lưu ý:</strong> Mã OTP này có hiệu lực trong <strong>5 phút</strong>. 
                Vui lòng không chia sẻ mã này với bất kỳ ai.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #888; font-size: 14px;">
                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.<br>
                Mọi thắc mắc, liên hệ: <a href="mailto:support@devora.com">support@edvora.com</a>
              </p>
              <p style="color: #888; font-size: 12px; margin-top: 15px;">
                © 2024 Edvora LMS. All rights reserved.
              </p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      
      return {
        success: true,
        message: 'OTP đã được gửi thành công',
        expireTime: 5 // phút
      };
      
    } catch (error) {
      console.error('Lỗi gửi OTP:', error);
      throw new Error('Không thể gửi OTP');
    }
  }
};

module.exports = otpService;
