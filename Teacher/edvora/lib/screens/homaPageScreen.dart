import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'loginScreen.dart';

class HomePageScreen extends StatefulWidget {
  const HomePageScreen({Key? key}) : super(key: key);

  @override
  State<HomePageScreen> createState() => _HomePageScreenState();
}

class _HomePageScreenState extends State<HomePageScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Trang Chủ - LMS Teacher',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.blue[700],
        elevation: 2,
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () {
              _showLogoutDialog();
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header chào mừng
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blue[400]!, Colors.blue[600]!],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Chào mừng trở lại!',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Hệ thống quản lý học tập dành cho giáo viên',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Tiêu đề menu chức năng
            const Text(
              'Chức năng chính',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Grid menu chức năng
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  _buildMenuCard(
                    icon: Icons.class_,
                    title: 'Quản lý lớp học',
                    color: Colors.green,
                    onTap: () {
                      // TODO: Navigate to class management
                    },
                  ),
                  _buildMenuCard(
                    icon: Icons.people,
                    title: 'Danh sách học sinh',
                    color: Colors.orange,
                    onTap: () {
                      // TODO: Navigate to student list
                    },
                  ),
                  _buildMenuCard(
                    icon: Icons.assignment,
                    title: 'Bài tập',
                    color: Colors.purple,
                    onTap: () {
                      // TODO: Navigate to assignments
                    },
                  ),
                  _buildMenuCard(
                    icon: Icons.grade,
                    title: 'Điểm số',
                    color: Colors.red,
                    onTap: () {
                      // TODO: Navigate to grades
                    },
                  ),
                  _buildMenuCard(
                    icon: Icons.schedule,
                    title: 'Thời khóa biểu',
                    color: Colors.teal,
                    onTap: () {
                      // TODO: Navigate to schedule
                    },
                  ),
                  _buildMenuCard(
                    icon: Icons.settings,
                    title: 'Cài đặt',
                    color: Colors.grey,
                    onTap: () {
                      // TODO: Navigate to settings
                    },
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
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 48,
                color: color,
              ),
              const SizedBox(height: 12),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Đăng xuất'),
          content: const Text('Bạn có chắc chắn muốn đăng xuất?'),
          actions: [
            TextButton(
              child: const Text('Hủy'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('Đăng xuất'),
              onPressed: () async {
                Navigator.of(context).pop(); // Đóng dialog trước
                
                try {
                  // Gọi API logout để xóa dữ liệu người dùng
                  await ApiService.logout();
                  
                  // Điều hướng về màn hìnn đănh nhập
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (context) => LoginScreen()),
                    (Route<dynamic> route) => false,
                  );
                  // hiển thị thông báo đăng xuất thành công
                    ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Đăng xuất thành công')),
                    );
                } catch (e) {
                  // Hiển thị thông báo lỗi nếu có
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Lỗi đăng xuất: $e')),
                  );
                }
              },
            ),
          ],
        );
      },
    );
  }
}


