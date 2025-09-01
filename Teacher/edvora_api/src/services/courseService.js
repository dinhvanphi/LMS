const Course = require('../models/Course');

class CourseService {
  // Tạo mã đăng ký ngẫu nhiên
  static generateEnrollmentCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Tạo mã đăng ký duy nhất
  static async generateUniqueEnrollmentCode() {
    let enrollment_code;
    let isUnique = false;
    
    while (!isUnique) {
      enrollment_code = this.generateEnrollmentCode();
      const existing = await Course.findOne({ where: { enrollment_code } });
      if (!existing) isUnique = true;
    }
    
    return enrollment_code;
  }

  // Kiểm tra mã khóa học đã tồn tại
  static async checkCourseCodeExists(course_code) {
    const existingCourse = await Course.findOne({ where: { course_code } });
    return !!existingCourse;
  }

  // Validate dữ liệu tạo khóa học
  static validateCourseData(data) {
    const { course_code, course_name, instructor_id, start_date, end_date } = data;
    
    const errors = [];

    if (!course_code) errors.push('Mã khóa học là bắt buộc');
    if (!course_name) errors.push('Tên khóa học là bắt buộc');
    if (!instructor_id) errors.push('ID giảng viên là bắt buộc');
    
    // Validate dates
    if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
      errors.push('Ngày bắt đầu phải trước ngày kết thúc');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Tạo khóa học mới
  static async createCourse(courseData) {
    const {
      course_code,
      course_name,
      description,
      instructor_id,
      start_date,
      end_date,
      is_published
    } = courseData;

    // Validate dữ liệu
    const validation = this.validateCourseData(courseData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Kiểm tra mã khóa học đã tồn tại
    const codeExists = await this.checkCourseCodeExists(course_code);
    if (codeExists) {
      throw new Error('Mã khóa học đã tồn tại');
    }

    // Tạo mã đăng ký duy nhất
    const enrollment_code = await this.generateUniqueEnrollmentCode();

    // Tạo khóa học
    const newCourse = await Course.create({
      course_code,
      course_name,
      description,
      instructor_id,
      start_date: start_date || null,
      end_date: end_date || null,
      is_published: is_published || false,
      enrollment_code
    });

    return newCourse;
  }

  // Lấy danh sách khóa học theo giảng viên
  static async getCoursesByInstructor(instructor_id) {
    if (!instructor_id) {
      throw new Error('ID giảng viên là bắt buộc');
    }

    const courses = await Course.findAll({
      where: { instructor_id },
      order: [['created_at', 'DESC']]
    });

    return courses;
  }

  // Lấy thông tin khóa học theo ID
  static async getCourseById(course_id) {
    if (!course_id) {
      throw new Error('ID khóa học là bắt buộc');
    }

    const course = await Course.findByPk(course_id);
    if (!course) {
      throw new Error('Không tìm thấy khóa học');
    }

    return course;
  }

  // Cập nhật khóa học
  static async updateCourse(course_id, updateData) {
    const course = await this.getCourseById(course_id);
    
    // Validate dữ liệu cập nhật
    if (updateData.course_code && updateData.course_code !== course.course_code) {
      const codeExists = await this.checkCourseCodeExists(updateData.course_code);
      if (codeExists) {
        throw new Error('Mã khóa học đã tồn tại');
      }
    }

    // Validate dates nếu có
    if (updateData.start_date && updateData.end_date) {
      if (new Date(updateData.start_date) >= new Date(updateData.end_date)) {
        throw new Error('Ngày bắt đầu phải trước ngày kết thúc');
      }
    }

    await course.update(updateData);
    return course;
  }

  // Xóa khóa học
  static async deleteCourse(course_id) {
    const course = await this.getCourseById(course_id);
    await course.destroy();
    return true;
  }

  // Lấy thống kê khóa học của giảng viên
  static async getInstructorCourseStats(instructor_id) {
    const courses = await this.getCoursesByInstructor(instructor_id);
    
    const stats = {
      total_courses: courses.length,
      published_courses: courses.filter(c => c.is_published).length,
      draft_courses: courses.filter(c => !c.is_published).length,
      active_courses: courses.filter(c => {
        const now = new Date();
        return c.start_date && c.end_date && 
               new Date(c.start_date) <= now && 
               new Date(c.end_date) >= now;
      }).length
    };

    return stats;
  }
}

module.exports = CourseService;
