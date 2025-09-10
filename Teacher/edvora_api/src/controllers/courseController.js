const CourseService = require('../services/courseService');

class CourseController {
  // Tạo khóa học mới
  static async createCourse(req, res) {
    try {
      const courseData = req.body;
      const newCourse = await CourseService.createCourse(courseData);

      res.status(201).json({
        success: true,
        message: 'Tạo khóa học thành công',
        data: {
          course_id: newCourse.course_id,
          course_code: newCourse.course_code,
          course_name: newCourse.course_name,
          description: newCourse.description,
          instructor_id: newCourse.instructor_id,
          start_date: newCourse.start_date,
          end_date: newCourse.end_date,
          is_published: newCourse.is_published,
          enrollment_code: newCourse.enrollment_code,
          created_at: newCourse.created_at
        }
      });

    } catch (error) {
      console.error('Lỗi tạo khóa học:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Mã khóa học hoặc mã đăng ký đã tồn tại'
        });
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tạo khóa học',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Lấy danh sách khóa học theo giảng viên
  static async getCoursesByInstructor(req, res) {
    try {
      const { instructor_id } = req.params;
      const courses = await CourseService.getCoursesByInstructor(instructor_id);

      res.json({
        success: true,
        message: 'Lấy danh sách khóa học thành công',
        count: courses.length,
        data: courses
      });

    } catch (error) {
      console.error('Lỗi lấy danh sách khóa học:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy danh sách khóa học'
      });
    }
  }

  // Lấy thông tin khóa học theo ID
  static async getCourseById(req, res) {
    try {
      const { course_id } = req.params;
      const course = await CourseService.getCourseById(course_id);

      res.json({
        success: true,
        message: 'Lấy thông tin khóa học thành công',
        data: course
      });

    } catch (error) {
      console.error('Lỗi lấy thông tin khóa học:', error);
      const statusCode = error.message === 'Không tìm thấy khóa học' ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Lỗi khi lấy thông tin khóa học'
      });
    }
  }

  // Cập nhật khóa học
  static async updateCourse(req, res) {
    try {
      const { course_id } = req.params;
      const updateData = req.body;
      
      const updatedCourse = await CourseService.updateCourse(course_id, updateData);

      res.json({
        success: true,
        message: 'Cập nhật khóa học thành công',
        data: updatedCourse
      });

    } catch (error) {
      console.error('Lỗi cập nhật khóa học:', error);
      const statusCode = error.message === 'Không tìm thấy khóa học' ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật khóa học'
      });
    }
  }

  // Xóa khóa học
  static async deleteCourse(req, res) {
    try {
      const { course_id } = req.params;
      await CourseService.deleteCourse(course_id);

      res.json({
        success: true,
        message: 'Xóa khóa học thành công'
      });

    } catch (error) {
      console.error('Lỗi xóa khóa học:', error);
      const statusCode = error.message === 'Không tìm thấy khóa học' ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Lỗi khi xóa khóa học'
      });
    }
  }

  // Lấy thống kê khóa học của giảng viên
  static async getInstructorStats(req, res) {
    try {
      const { instructor_id } = req.params;
      const stats = await CourseService.getInstructorCourseStats(instructor_id);

      res.json({
        success: true,
        message: 'Lấy thống kê khóa học thành công',
        data: stats
      });

    } catch (error) {
      console.error('Lỗi lấy thống kê khóa học:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy thống kê khóa học'
      });
    }
  }
}

module.exports = CourseController;
