const transporter = require("../utils/transporter");

async function sendOTP(email, otp, isPasswordReset = false) {
  try {
    const subject = isPasswordReset 
      ? "Đặt lại mật khẩu CineNow"
      : "Xác thực tài khoản CineNow";

    let htmlContent = "";

    if (isPasswordReset) {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color:rgb(216, 20, 20);">Studivo - Đặt lại mật khẩu</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu trên Studivo.</p>
          <p>Mã xác nhận của bạn là:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>Mã này có hiệu lực trong vòng 10 phút.</p>
          <p>Nếu bạn không thực hiện yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <p>Trân trọng,<br>Đội ngũ Studivo</p>
        </div>
      `;
    } else {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color:rgb(168, 18, 18);">Studivo - Xác thực tài khoản</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại Edrova.</p>
          <p>Mã OTP của bạn là:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>Mã này có hiệu lực trong vòng 10 phút.</p>
          <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
          <p>Trân trọng,<br>Đội ngũ Studivo/p>
        </div>
      `;
    }

    await transporter.sendMail({
      from: `"CineNow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: htmlContent
    });

    console.log(`✅ Email ${isPasswordReset ? "đặt lại mật khẩu" : "OTP đăng ký"} đã gửi đến:`, email);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi gửi email ${isPasswordReset ? "đặt lại mật khẩu" : "OTP đăng ký"}:`, error);
    return false;
  }
}

module.exports = { sendOTP };
