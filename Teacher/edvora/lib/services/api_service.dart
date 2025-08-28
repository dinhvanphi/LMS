import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Cập nhật port từ 5001 thành 5002 để match với Edvora server
  static const String baseUrl = 'http://localhost:5002/api/auth';
  
  // Send OTP - Thêm debug log
  static Future<Map<String, dynamic>> sendOtp(String email) async {
    try {
      print('🔄 Sending OTP to: $email');
      print('🌐 URL: $baseUrl/send-otp');
      
      final response = await http.post(
        Uri.parse('$baseUrl/send-otp'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
        }),
      );

      print('📋 Response Status: ${response.statusCode}');
      print('📋 Response Body: ${response.body}');

      return {
        'success': response.statusCode == 200,
        'data': jsonDecode(response.body),
        'statusCode': response.statusCode,
      };
    } catch (e) {
      print('❌ Error in sendOtp: $e');
      return {
        'success': false,
        'error': 'Network error: $e',
        'statusCode': 0,
      };
    }
  }

  // Verify OTP - Thêm debug log
  static Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    try {
      print('🔄 Verifying OTP: $email - $otp');
      
      final response = await http.post(
        Uri.parse('$baseUrl/verify-otp'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
          'otp': otp,
        }),
      );

      print('📋 Verify Response Status: ${response.statusCode}');
      print('📋 Verify Response Body: ${response.body}');

      return {
        'success': response.statusCode == 200,
        'data': jsonDecode(response.body),
        'statusCode': response.statusCode,
      };
    } catch (e) {
      print('❌ Error in verifyOtp: $e');
      return {
        'success': false,
        'error': 'Network error: $e',
        'statusCode': 0,
      };
    }
  }

  // Register - Sửa để split fullName thành first_name và last_name
  static Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String fullName,
    required String otp,
  }) async {
    try {
      print('🔄 Registering user: $email');
      
      // Split fullName thành first_name và last_name
      List<String> nameParts = fullName.trim().split(' ');
      String firstName = nameParts[0];
      String lastName = nameParts.length > 1 ? nameParts.sublist(1).join(' ') : nameParts[0];
      
      final requestBody = {
        'email': email,
        'password': password,
        'fullName': fullName,
        'first_name': firstName,
        'last_name': lastName,
        'otp': otp,
      };
      
      print('📤 Request body: $requestBody');
      
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(requestBody),
      );

      print('📋 Register Response Status: ${response.statusCode}');
      print('📋 Register Response Body: ${response.body}');

      final responseData = jsonDecode(response.body);
      
      // Lưu token nếu đăng ký thành công
      if (response.statusCode == 201 && responseData['token'] != null) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('auth_token', responseData['token']);
        await prefs.setString('user_email', email);
        await prefs.setString('user_name', fullName);
      }

      return {
        'success': response.statusCode == 201,
        'data': responseData,
        'statusCode': response.statusCode,
      };
    } catch (e) {
      print('❌ Error in register: $e');
      return {
        'success': false,
        'error': 'Network error: $e',
        'statusCode': 0,
      };
    }
  }

  // Login
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:5002/api/auth/login'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final Map<String, dynamic> responseData = jsonDecode(response.body);

      if (response.statusCode == 200) {
        // Đăng nhập thành công
        return {
          'success': true,
          'data': responseData,
          'message': 'Đăng nhập thành công'
        };
      } else {
        // Đăng nhập thất bại
        return {
          'success': false,
          'message': responseData['message'] ?? 'Đăng nhập thất bại'
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Lỗi kết nối: ${e.toString()}'
      };
    }
  }

  // Logout
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_email');
    await prefs.remove('user_name');
  }

  // Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token') != null;
  }

  // Get saved token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('user_name');
  }
}
