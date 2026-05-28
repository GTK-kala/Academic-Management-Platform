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
import { useAuth } from "../../context/AuthContext";
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
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data?.course || null);

        // Fetch enrolled students
        const enrollmentsRes = await api.get(`/enrollments?course_id=${id}`);
        const enrollments = enrollmentsRes.data?.enrollments || [];
        setEnrolledStudents(enrollments);

        // Fetch attendance stats
        const attendanceRes = await api.get(`/attendance?course_id=${id}`);
        const attendance = attendanceRes.data?.attendance || [];
        setAttendanceStats({
          totalClasses: new Set(attendance.map((a) => a.attendance_date)).size,
          averageAttendance:
            attendance.length > 0
              ? Math.round(
                  (attendance.filter((a) => a.status === "present").length /
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Course not found
        </h2>
        <Link
          to="/courses"
          className="text-primary hover:underline mt-4 inline-block"
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
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Courses</span>
        </button>
        {user?.role === "admin" && (
          <div className="flex gap-2">
            <Link to={`/courses/${id}/edit`}>
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
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/20 text-primary dark:text-primary-300">
                {course.course_code}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                Active
              </span>
            </div>
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-3">
              {course.course_name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {course.description || "No description available"}
            </p>

            {/* Course Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl">
                <FiUsers className="w-5 h-5 text-primary dark:text-primary-300 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Students
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {enrolledStudents.length}/{course.max_capacity}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl">
                <FiClock className="w-5 h-5 text-primary dark:text-primary-300 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Credits
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {course.credits}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl">
                <FiCalendar className="w-5 h-5 text-primary dark:text-primary-300 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Attendance
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {attendanceStats?.averageAttendance || 0}%
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-dark-bg p-4 rounded-xl">
                <FiBarChart2 className="w-5 h-5 text-primary dark:text-primary-300 mb-2" />
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
          <div className="lg:w-64 bg-gray-50 dark:bg-dark-bg p-6 rounded-xl text-center">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-10 h-10 text-primary dark:text-primary-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {course.teacher_first
                ? `${course.teacher_first} ${course.teacher_last || ""}`
                : "Unassigned"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Instructor
            </p>
            {course.teacher_department && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {course.teacher_department}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
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
                  <Button className="flex items-center gap-2 text-sm">
                    <FiUserPlus className="w-4 h-4" /> Add Student
                  </Button>
                )}
              </div>
              {enrolledStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-dark-border">
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
                          <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">
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
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No students enrolled yet
                </p>
              )}
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="text-center py-8">
              <FiCalendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Attendance records for this course
              </p>
              <Link
                to="/attendance"
                className="text-primary hover:underline mt-2 inline-block"
              >
                Go to Attendance
              </Link>
            </div>
          )}

          {activeTab === "grades" && (
            <div className="text-center py-8">
              <FiBarChart2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Grade records for this course
              </p>
              <Link
                to="/grades"
                className="text-primary hover:underline mt-2 inline-block"
              >
                Go to Grades
              </Link>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="text-center py-8">
              <FiDollarSign className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Fee structures for this course
              </p>
              <Link
                to="/fees"
                className="text-primary hover:underline mt-2 inline-block"
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
