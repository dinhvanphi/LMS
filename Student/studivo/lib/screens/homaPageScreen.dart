import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'loginScreen.dart';

class HomePageScreen extends StatefulWidget {
  final Map<String, dynamic>? userData;
  
  const HomePageScreen({Key? key, this.userData}) : super(key: key);

  @override
  _HomePageScreenState createState() => _HomePageScreenState();
}

class _HomePageScreenState extends State<HomePageScreen> {
  String userName = '';
  String userEmail = '';

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  void _loadUserData() {
    if (widget.userData != null) {
      setState(() {
        userName = '${widget.userData!['first_name']} ${widget.userData!['last_name']}';
        userEmail = widget.userData!['email'];
      });
    }
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => LoginScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(
          'Studivo LMS',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: Color(0xFFB23B3B),
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.logout, color: Colors.white),
            onPressed: _logout,
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header với thông tin user
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: Color(0xFFB23B3B),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
              ),
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.white,
                      child: Icon(
                        Icons.person,
                        size: 50,
                        color: Color(0xFFB23B3B),
                      ),
                    ),
                    SizedBox(height: 15),
                    Text(
                      'Chào mừng!',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      userName.isNotEmpty ? userName : 'Học viên',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 5),
                    Text(
                      userEmail,
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                    SizedBox(height: 20),
                  ],
                ),
              ),
            ),
            
            // Menu chính
            Padding(
              padding: EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Tính năng chính',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  SizedBox(height: 20),
                  
                  // Grid menu
                  GridView.count(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    crossAxisSpacing: 15,
                    mainAxisSpacing: 15,
                    children: [
                      _buildMenuCard(
                        icon: Icons.book,
                        title: 'Khóa học',
                        subtitle: 'Xem các khóa học',
                        onTap: () {
                          // Navigate to courses
                        },
                      ),
                      _buildMenuCard(
                        icon: Icons.assignment,
                        title: 'Bài tập',
                        subtitle: 'Làm bài tập',
                        onTap: () {
                          // Navigate to assignments
                        },
                      ),
                      _buildMenuCard(
                        icon: Icons.quiz,
                        title: 'Kiểm tra',
                        subtitle: 'Làm bài kiểm tra',
                        onTap: () {
                          // Navigate to quizzes
                        },
                      ),
                      _buildMenuCard(
                        icon: Icons.grade,
                        title: 'Điểm số',
                        subtitle: 'Xem kết quả học tập',
                        onTap: () {
                          // Navigate to grades
                        },
                      ),
                    ],
                  ),
                  
                  SizedBox(height: 30),
                  
                  // Thông báo gần đây
                  Text(
                    'Thông báo gần đây',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  SizedBox(height: 15),
                  
                  _buildNotificationCard(
                    title: 'Chào mừng đến với Edvora LMS!',
                    content: 'Bạn đã đăng nhập thành công. Hãy bắt đầu hành trình học tập của mình.',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              spreadRadius: 1,
              blurRadius: 5,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: EdgeInsets.all(15),
                decoration: BoxDecoration(
                  color: Color(0xFFB23B3B).withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  size: 30,
                  color: Color(0xFFB23B3B),
                ),
              ),
              SizedBox(height: 10),
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 5),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNotificationCard({
    required String title,
    required String content,
    required String time,
  }) {
    return Container(
      width: double.infinity,
      margin: EdgeInsets.only(bottom: 10),
      padding: EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 3,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ),
              Text(
                time,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
            ],
          ),
          SizedBox(height: 8),
          Text(
            content,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[700],
            ),
          ),
        ],
      ),
    );
  }
}
