import { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiUsers,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
  FiEdit,
  FiTrash2,
  FiUserPlus,
} from "react-icons/fi";
import api from "../../services/api";
import Button from "../../components/common/Button";
import { Get_Course, Enrolled_Courses } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";
import { Get_Attendances } from "../../services/attendanceService";
import { useParams, useNavigate, Link } from "react-router-dom";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Fetch course details
        const user = JSON.parse(localStorage.getItem("user"));
        const courseRes = await Get_Course(id);
        const courseData = courseRes?.course || null;
        setCourse(courseData);

        // Fetch enrolled students
        const enrollmentsRes = await Enrolled_Courses(
          user?.userId,
          user?.role,
          id,
        );
        const enrollments = enrollmentsRes?.enrollments || [];
        setEnrolledStudents(enrollments);

        // Fetch attendance stats
        const attendanceRes = await Get_Attendances(
          courseData?.id,
          user?.role,
          user?.userId,
        );
        const attendance = attendanceRes?.attendance || [];
        setAttendanceStats({
          totalClasses: new Set(attendance.map((a) => a.attendance_date)).size,
          averageAttendance:
            attendance.length > 0
              ? Math.round(
                  (attendance.filter((a) => a.status === "Excused").length /
                    attendance.length) *
                    100,
                )
              : 0,
        });
      } catch (error) {
        console.error("Failed to load course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourseDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      navigate("/courses");
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Course not found
        </h2>
        <Link
          to="/courses"
          className="inline-block mt-4 text-primary hover:underline"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center gap-2 text-gray-600 transition-colors dark:text-gray-400 hover:text-primary dark:hover:text-primary-300"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Courses</span>
        </button>
        {user?.role === "admin" && (
          <div className="flex gap-2">
            <Link to={`/courses/edit/${id}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <FiEdit className="w-4 h-4" /> Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <FiTrash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        )}
      </div>

      {/* Course Header */}
      <div className="p-8 mb-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-2xl dark:border-dark-border">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary dark:text-primary-300">
                {course.course_code}
              </span>
              <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full dark:bg-green-900/20 dark:text-green-400">
                Active
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-bold text-primary dark:text-white">
              {course.course_name}
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {course.description || "No description available"}
            </p>

            {/* Course Info Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
                <FiUsers className="w-5 h-5 mb-2 text-primary dark:text-primary-300" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Students
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {course.count || 0}/{course.max_capacity}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
                <FiClock className="w-5 h-5 mb-2 text-primary dark:text-primary-300" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Credits
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {course.credits}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
                <FiCalendar className="w-5 h-5 mb-2 text-primary dark:text-primary-300" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Attendance
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {attendanceStats?.status || 0}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
                <FiBarChart2 className="w-5 h-5 mb-2 text-primary dark:text-primary-300" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Avg Grade
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  B+
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Card */}
          <div className="p-6 text-center lg:w-64 bg-gray-50 dark:bg-dark-bg rounded-xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/20">
              <FiUsers className="w-10 h-10 text-primary dark:text-primary-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {course.teacher_name || "TBA"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Instructor
            </p>
            {course.department && (
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                {course.department}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
        <div className="border-b border-gray-200 dark:border-dark-border">
          <nav className="flex gap-0">
            {["students", "attendance", "grades", "fees"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-primary text-primary dark:text-primary-300"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "students" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Enrolled Students
                </h3>
                {user?.role === "admin" && (
                  <Link to="/students/add">
                    <Button className="flex items-center gap-2 text-sm">
                      <FiUserPlus className="w-4 h-4" /> Add Student
                    </Button>
                  </Link>
                )}
              </div>
              {enrolledStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-dark-border">
                        <th className="pb-3 pr-4">Student</th>
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">Enrollment Date</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledStudents.map((enrollment) => (
                        <tr
                          key={enrollment.id}
                          className="text-sm border-b border-gray-100 dark:border-dark-border"
                        >
                          <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                            {enrollment.first_name} {enrollment.last_name}
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {enrollment.email || "N/A"}
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {new Date(
                              enrollment.enrollment_date,
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                enrollment.status === "active"
                                  ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {enrollment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No students enrolled yet
                </p>
              )}
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="py-8 text-center">
              <FiCalendar className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">
                Attendance records for this course
              </p>
              <Link
                to="/attendance"
                className="inline-block mt-2 text-primary hover:underline"
              >
                Go to Attendance
              </Link>
            </div>
          )}

          {activeTab === "grades" && (
            <div className="py-8 text-center">
              <FiBarChart2 className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">
                Grade records for this course
              </p>
              <Link
                to="/grades"
                className="inline-block mt-2 text-primary hover:underline"
              >
                Go to Grades
              </Link>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="py-8 text-center">
              <FiDollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">
                Fee structures for this course
              </p>
              <Link
                to="/fees"
                className="inline-block mt-2 text-primary hover:underline"
              >
                Go to Fees
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
