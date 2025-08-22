const { sendOTP } = require("../services/otpService");
const { generateOTP } = require("../utils/generateOTP");

async function sendOTPController(req, res) {
  try {
    const { email, isPasswordReset } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email là bắt buộc" });
    }

    const otp = generateOTP();
    const success = await sendOTP(email, otp, isPasswordReset);

    if (success) {
      // TODO: Lưu OTP vào DB hoặc Redis để verify sau
      return res.status(200).json({ message: "OTP đã gửi thành công", otp });
    } else {
      return res.status(500).json({ message: "Không thể gửi OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
}

module.exports = { sendOTPController };
