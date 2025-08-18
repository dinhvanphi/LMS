import 'package:flutter/material.dart';

void main() {
  runApp(const StudivoApp());
}

class StudivoApp extends StatelessWidget {
  const StudivoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Studivo - LMS Student',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2196F3),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    const DashboardPage(),
    const CoursesPage(),
    const AssignmentsPage(),
    const GradesPage(),
    const SchedulePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Studivo'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.account_circle),
            onPressed: () {},
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(
                color: Color(0xFF2196F3),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: Colors.white,
                    child: Icon(Icons.person, size: 35, color: Color(0xFF2196F3)),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Nguyễn Văn A',
                    style: TextStyle(color: Colors.white, fontSize: 18),
                  ),
                  Text(
                    'MSSV: 2024001',
                    style: TextStyle(color: Colors.white70, fontSize: 14),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard),
              title: const Text('Trang chủ'),
              selected: _selectedIndex == 0,
              onTap: () => _onItemTapped(0),
            ),
            ListTile(
              leading: const Icon(Icons.book),
              title: const Text('Khóa học'),
              selected: _selectedIndex == 1,
              onTap: () => _onItemTapped(1),
            ),
            ListTile(
              leading: const Icon(Icons.assignment),
              title: const Text('Bài tập'),
              selected: _selectedIndex == 2,
              onTap: () => _onItemTapped(2),
            ),
            ListTile(
              leading: const Icon(Icons.grade),
              title: const Text('Điểm số'),
              selected: _selectedIndex == 3,
              onTap: () => _onItemTapped(3),
            ),
            ListTile(
              leading: const Icon(Icons.schedule),
              title: const Text('Lịch học'),
              selected: _selectedIndex == 4,
              onTap: () => _onItemTapped(4),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.settings),
              title: const Text('Cài đặt'),
              onTap: () {},
            ),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Đăng xuất'),
              onTap: () {},
            ),
          ],
        ),
      ),
      body: _pages[_selectedIndex],
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    Navigator.of(context).pop();
  }
}

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Chào mừng trở lại!',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          
          // Quick Stats
          Row(
            children: [
              Expanded(
                child: _buildStatCard('Khóa học', '5', Icons.book, Colors.blue),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildStatCard('Bài tập', '12', Icons.assignment, Colors.orange),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _buildStatCard('Hoàn thành', '8', Icons.check_circle, Colors.green),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildStatCard('Sắp hạn', '3', Icons.access_time, Colors.red),
              ),
            ],
          ),
          
          const SizedBox(height: 30),
          
          // Recent Activities
          const Text(
            'Hoạt động gần đây',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 15),
          _buildActivityItem('Nộp bài tập: Lập trình Java', '2 giờ trước'),
          _buildActivityItem('Hoàn thành bài kiểm tra: Cơ sở dữ liệu', '1 ngày trước'),
          _buildActivityItem('Tham gia lớp học: Thiết kế Web', '2 ngày trước'),
          
          const SizedBox(height: 30),
          
          // Upcoming Events
          const Text(
            'Sự kiện sắp tới',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 15),
          _buildEventItem('Kiểm tra giữa kỳ - Cấu trúc dữ liệu', 'Thứ 2, 14:00'),
          _buildEventItem('Hạn nộp bài tập - Mạng máy tính', 'Thứ 4, 23:59'),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            Text(title, style: const TextStyle(fontSize: 14)),
          ],
        ),
      ),
    );
  }

  Widget _buildActivityItem(String title, String time) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: const Icon(Icons.history),
        title: Text(title),
        subtitle: Text(time),
      ),
    );
  }

  Widget _buildEventItem(String title, String time) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: const Icon(Icons.event),
        title: Text(title),
        subtitle: Text(time),
        trailing: const Icon(Icons.arrow_forward_ios),
      ),
    );
  }
}

class CoursesPage extends StatelessWidget {
  const CoursesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5,
      itemBuilder: (context, index) {
        final courses = [
          {'name': 'Lập trình Java', 'instructor': 'TS. Nguyễn Văn B', 'progress': 0.8},
          {'name': 'Cơ sở dữ liệu', 'instructor': 'PGS. Trần Thị C', 'progress': 0.6},
          {'name': 'Mạng máy tính', 'instructor': 'ThS. Lê Văn D', 'progress': 0.4},
          {'name': 'Thiết kế Web', 'instructor': 'CN. Phạm Thị E', 'progress': 0.9},
          {'name': 'Cấu trúc dữ liệu', 'instructor': 'TS. Hoàng Văn F', 'progress': 0.3},
        ];
        
        final course = courses[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course['name'] as String,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Text(course['instructor'] as String),
                const SizedBox(height: 10),
                LinearProgressIndicator(
                  value: course['progress'] as double,
                  backgroundColor: Colors.grey[300],
                ),
                const SizedBox(height: 5),
                Text('${((course['progress'] as double) * 100).toInt()}% hoàn thành'),
              ],
            ),
          ),
        );
      },
    );
  }
}

class AssignmentsPage extends StatelessWidget {
  const AssignmentsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildAssignmentCard('Bài tập Java - OOP', 'Lập trình Java', 'Hạn: 25/12/2024', false),
        _buildAssignmentCard('Thiết kế cơ sở dữ liệu', 'Cơ sở dữ liệu', 'Hạn: 28/12/2024', false),
        _buildAssignmentCard('Phân tích giao thức TCP', 'Mạng máy tính', 'Đã nộp', true),
        _buildAssignmentCard('Tạo website responsive', 'Thiết kế Web', 'Đã nộp', true),
      ],
    );
  }

  Widget _buildAssignmentCard(String title, String course, String deadline, bool isCompleted) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(
          isCompleted ? Icons.check_circle : Icons.assignment,
          color: isCompleted ? Colors.green : Colors.orange,
        ),
        title: Text(title),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(course),
            Text(
              deadline,
              style: TextStyle(
                color: isCompleted ? Colors.green : Colors.red,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        trailing: const Icon(Icons.arrow_forward_ios),
      ),
    );
  }
}

class GradesPage extends StatelessWidget {
  const GradesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildGradeCard('Lập trình Java', '8.5', 'A'),
        _buildGradeCard('Cơ sở dữ liệu', '7.8', 'B+'),
        _buildGradeCard('Mạng máy tính', '9.0', 'A+'),
        _buildGradeCard('Thiết kế Web', '8.2', 'A'),
        _buildGradeCard('Cấu trúc dữ liệu', '7.5', 'B+'),
      ],
    );
  }

  Widget _buildGradeCard(String course, String score, String grade) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(course),
        subtitle: Text('Điểm: $score'),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: _getGradeColor(grade),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            grade,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }

  Color _getGradeColor(String grade) {
    switch (grade) {
      case 'A+':
      case 'A':
        return Colors.green;
      case 'B+':
      case 'B':
        return Colors.blue;
      case 'C+':
      case 'C':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }
}

class SchedulePage extends StatelessWidget {
  const SchedulePage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildScheduleCard('Thứ 2', [
          {'time': '08:00 - 10:00', 'subject': 'Lập trình Java', 'room': 'P.201'},
          {'time': '14:00 - 16:00', 'subject': 'Cơ sở dữ liệu', 'room': 'P.105'},
        ]),
        _buildScheduleCard('Thứ 3', [
          {'time': '10:00 - 12:00', 'subject': 'Mạng máy tính', 'room': 'P.301'},
        ]),
        _buildScheduleCard('Thứ 4', [
          {'time': '08:00 - 10:00', 'subject': 'Thiết kế Web', 'room': 'P.Computer'},
          {'time': '14:00 - 16:00', 'subject': 'Cấu trúc dữ liệu', 'room': 'P.205'},
        ]),
        _buildScheduleCard('Thứ 5', [
          {'time': '10:00 - 12:00', 'subject': 'Lập trình Java (Thực hành)', 'room': 'P.Computer'},
        ]),
        _buildScheduleCard('Thứ 6', [
          {'time': '08:00 - 10:00', 'subject': 'Cơ sở dữ liệu (Thực hành)', 'room': 'P.Computer'},
        ]),
      ],
    );
  }

  Widget _buildScheduleCard(String day, List<Map<String, String>> classes) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              day,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            ...classes.map((classInfo) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Text(classInfo['time']!),
                  ),
                  Expanded(
                    flex: 3,
                    child: Text(classInfo['subject']!),
                  ),
                  Expanded(
                    child: Text(classInfo['room']!),
                  ),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }
}
