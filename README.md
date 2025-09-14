# 🎓 LMS (Learning Management System)

Hệ thống quản lý học tập bao gồm 2 ứng dụng riêng biệt cho **Giảng viên** (Edvora) và **Sinh viên** (Studivo).

## 📱 Ứng dụng

### 1. **Teacher App - Edvora** 🧑‍🏫
- **Platform**: Flutter (iOS/Android)
- **API Backend**: Node.js + Express + PostgreSQL
- **Port**: 5002
- **Màu chủ đạo**: Blue (#2196F3)

### 2. **Student App - Studivo** 🎓
- **Platform**: Flutter (iOS/Android) 
- **API Backend**: Node.js + Express + PostgreSQL
- **Port**: 5001
- **Màu chủ đạo**: Blue

## 🏗️ Cấu trúc thư mục

```
LMS/
├── Teacher/
│   └── edvora/                    # Flutter Teacher Application 
│       ├── lib/
│       │   ├── screens/
│       │   │   ├── loginScreen.dart
│       │   │   ├── signupScreen.dart
│       │   │   ├── otpScreen.dart
│       │   │   └── homaPageScreen.dart
│       │   └── services/
│       │       └── api_service.dart
│       └── pubspec.yaml
│
├── Student/
│   └── studivo/                   # Flutter Student App
│       ├── lib/
│       │   ├── screens/
│       │   └── services/
│       └── pubspec.yaml
│
├── edvora_api/                    # Teacher API Backend
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── models/
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── studivo_api/                   # Student API Backend (port 5001)
└── README.md
```

## 🚀 API Endpoints

### **Teacher API (Edvora) - Port 5002**
```bash
🌐 Base URL: http://localhost:5002/api/auth

📧 Send OTP:     POST /api/auth/send-otp
🔐 Verify OTP:   POST /api/auth/verify-otp  
📝 Register:     POST /api/auth/register
🚪 Logout:       POST /api/auth/logout
```

### **Student API (Studivo) - Port 5001**
```bash
🌐 Base URL: http://localhost:5001/api/auth

📧 Send OTP:     POST /api/auth/send-otp
🔐 Verify OTP:   POST /api/auth/verify-otp
📝 Register:     POST /api/auth/register
```

## 🛠️ Cài đặt và chạy dự án

### **1. Cài đặt Teacher API (Edvora)**
```bash
cd edvora_api
npm install
npm run dev
# Server chạy trên http://localhost:5002
```

### **2. Cài đặt Student API (Studivo)**
```bash
cd studivo_api  
npm install
npm run dev
# Server chạy trên http://localhost:5001
```

### **3. Chạy Teacher App (Edvora)**
```bash
cd Teacher/edvora
flutter pub get
flutter run
```

### **4. Chạy Student App (Studivo)**
```bash
cd Student/studivo
flutter pub get
flutter run
```

## 🔧 Cấu hình

### **Database Configuration**
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Environment**: `.env` file trong mỗi API folder

### **Flutter Dependencies**
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  shared_preferences: ^2.2.2
```

## 📋 Tính năng hiện tại

### **Authentication Flow**
1. **📧 Send OTP**: Gửi mã OTP qua email
2. **✅ Verify OTP**: Xác thực mã OTP
3. **📝 Register**: Đăng ký tài khoản mới
4. **🔐 Login**: Đăng nhập
5. **🚪 Logout**: Đăng xuất an toàn

### **Teacher Dashboard Features**
- 🏠 **Home Screen
