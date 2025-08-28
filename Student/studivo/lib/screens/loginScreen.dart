import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'homaPageScreen.dart';
import 'package:flutter/material.dart';
import 'signupScreen.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      _showErrorDialog('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final response = await http.post(
        Uri.parse('http://172.25.12.230:5001/api/auth/login'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': _emailController.text.trim(),
          'password': _passwordController.text,
        }),
      );

      setState(() {
        _isLoading = false;
      });

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        
        // Kiểm tra cấu trúc response
        if (responseData['success'] == true && responseData['data'] != null) {
          final data = responseData['data'];
          
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', data['token']);
          await prefs.setString('user_data', jsonEncode(data['user']));

          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => HomePageScreen(userData: data['user']),
            ),
          );
        } else {
          _showErrorDialog(responseData['message'] ?? 'Đăng nhập thất bại');
        }
      } else {
        final errorData = jsonDecode(response.body);
        _showErrorDialog(errorData['message'] ?? errorData['error'] ?? 'Đăng nhập thất bại');
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showErrorDialog('Lỗi kết nối. Vui lòng kiểm tra lại server.');
      print('Login error: $e');
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Thông báo'),
          content: Text(message),
          actions: [
            TextButton(
              child: Text('OK', style: TextStyle(color: Color(0xFFB23B3B))),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header with image
            Container(
              height: 280,
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFFB23B3B),
                    Color(0xFF8B2B2B),
                  ],
                ),
                image: DecorationImage(
                  image: AssetImage('assets/building.jpeg'),
                  fit: BoxFit.cover,
                ),
              ),
              child: Stack(
                children: [
                  // Trapezoid overlay
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    child: ClipPath(
                      clipper: TrapezoidClipper(),
                      child: Container(
                        height: 50,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  // Avatar
                  Positioned(
                    bottom: 25,
                    left: 0,
                    right: 0,
                    child: Center(
                      child: Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: Color(0xFFB23B3B),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black26,
                              blurRadius: 8,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.school,
                          size: 40,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Content
            Padding(
              padding: EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 20),
                  Text(
                    'Login',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  SizedBox(height: 40),
                  // Email field
                  TextField(
                    controller: _emailController,
                    decoration: InputDecoration(
                      hintText: 'Email',
                      hintStyle: TextStyle(color: Colors.grey[400]),
                      enabledBorder: UnderlineInputBorder(
                        borderSide:
                            BorderSide(color: Color(0xFFB23B3B), width: 2),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide:
                            BorderSide(color: Color(0xFFB23B3B), width: 2),
                      ),
                    ),
                    keyboardType: TextInputType.emailAddress,
                  ),
                  SizedBox(height: 30),
                  // Password field
                  TextField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      hintText: 'Password',
                      hintStyle: TextStyle(color: Colors.grey[400]),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword
                              ? Icons.visibility_off
                              : Icons.visibility,
                          color: Colors.grey[600],
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                      enabledBorder: UnderlineInputBorder(
                        borderSide:
                            BorderSide(color: Color(0xFFB23B3B), width: 2),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide:
                            BorderSide(color: Color(0xFFB23B3B), width: 2),
                      ),
                    ),
                  ),
                  SizedBox(height: 40),
                  // Login button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _handleLogin,
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                            _isLoading ? Colors.grey : Color(0xFFB23B3B),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(25),
                        ),
                      ),
                      child: _isLoading
                          ? CircularProgressIndicator(
                              valueColor:
                                  AlwaysStoppedAnimation<Color>(Colors.white),
                            )
                          : Text(
                              'Login',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                    ),
                  ),
                  SizedBox(height: 20),
                  // Help text
                  Center(
                    child: GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => SignupScreen()),
                        );
                      },
                      child: Text(
                        'Signup ?',
                        style: TextStyle(
                          color: Color(0xFFB23B3B),
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Wave footer
            Container(
              height: 100,
              child: CustomPaint(
                painter: WavePainter(),
                size: Size(double.infinity, 100),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}

// Custom clipper for trapezoid shape
class TrapezoidClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    Path path = Path();
    path.moveTo(0, size.height);
    path.lineTo(0, 30);
    path.lineTo(size.width, 0);
    path.lineTo(size.width, size.height);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}

// Custom painter for wave
class WavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    Paint paint = Paint()
      ..color = Color(0xFFB23B3B)
      ..style = PaintingStyle.fill;

    Path path = Path();
    path.moveTo(0, size.height * 0.7);
    path.quadraticBezierTo(size.width * 0.25, size.height * 0.3,
        size.width * 0.5, size.height * 0.7);
    path.quadraticBezierTo(size.width * 0.75, size.height * 1.1,
        size.width, size.height * 0.7);
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
