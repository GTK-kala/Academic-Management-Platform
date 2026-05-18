import api from "../../services/api";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FiBook,
  FiDollarSign,
  FiCalendar,
  FiBarChart2,
  FiClock,
} from "react-icons/fi";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
  });
  const [recentGrades, setRecentGrades] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [feeSummary, setFeeSummary] = useState({ totalDue: 0, totalPaid: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch enrollments for this student
        const enrollmentsRes = await api.get(`/enrollments?student_id=1`); // You need actual student_id
        const enrollments = enrollmentsRes.data?.enrollments || [];

        // Fetch course details for enrolled courses
        const coursePromises = enrollments.map((e) =>
          api.get(`/courses/${e.course_id}`),
        );
        const courseResponses = await Promise.all(coursePromises);
        const courses = courseResponses
          .map((res) => res.data?.course)
          .filter(Boolean);
        setEnrolledCourses(courses);

        // Fetch recent grades (you'd filter by student in real app)
        const gradesRes = await api.get("/grades");
        setRecentGrades(gradesRes.data?.grades?.slice(0, 5) || []);

        // Fetch fee payments
        const feesRes = await api.get("/fees/payments");
        const payments = feesRes.data?.payments || [];
        setFeeSummary({
          totalDue: payments.reduce((sum, p) => sum + (p.total_due || 0), 0),
          totalPaid: payments.reduce((sum, p) => sum + p.amount_paid, 0),
        });

        // Attendance stats (simplified)
        const attendanceRes = await api.get("/attendance");
        const records = attendanceRes.data?.attendance || [];
        setAttendanceStats({
          present: records.filter((r) => r.status === "present").length,
          absent: records.filter((r) => r.status === "absent").length,
          late: records.filter((r) => r.status === "late").length,
        });
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-white">
          Welcome back, {user?.email?.split("@")[0]}!
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Here's your academic overview
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enrolled Courses
              </p>
              <p className="mt-2 text-2xl font-bold text-primary dark:text-white">
                {enrolledCourses.length}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <FiBook className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Attendance
              </p>
              <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                {attendanceStats.present + attendanceStats.absent > 0
                  ? Math.round(
                      (attendanceStats.present /
                        (attendanceStats.present + attendanceStats.absent)) *
                        100,
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <FiCalendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fees Paid
              </p>
              <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${feeSummary.totalPaid}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <FiDollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending Fees
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                ${feeSummary.totalDue - feeSummary.totalPaid}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl">
              <FiClock className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Enrolled Courses */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Courses
            </h2>
            <Link
              to="/courses"
              className="text-sm text-primary dark:text-primary-300 hover:underline"
            >
              Browse Courses
            </Link>
          </div>
          <div className="space-y-3">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-bg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {course.course_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {course.course_code}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {course.credits} credits
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                You are not enrolled in any courses yet.{" "}
                <Link to="/courses" className="text-primary hover:underline">
                  Browse available courses
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Grades
            </h2>
            <Link
              to="/grades"
              className="text-sm text-primary dark:text-primary-300 hover:underline"
            >
              View All
            </Link>
          </div>
          {recentGrades.length > 0 ? (
            <div className="space-y-3">
              {recentGrades.map((grade, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-bg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {grade.course_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {grade.exam_type}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-primary dark:text-primary-300">
                    {grade.grade}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500 dark:text-gray-400">
              No grades available yet
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-4">
        <Link
          to="/courses"
          className="flex flex-col items-center gap-2 p-4 transition-colors bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30"
        >
          <FiBook className="w-6 h-6 text-primary dark:text-primary-300" />
          <span className="text-sm font-medium text-primary dark:text-primary-300">
            Courses
          </span>
        </Link>
        <Link
          to="/attendance"
          className="flex flex-col items-center gap-2 p-4 transition-colors bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30"
        >
          <FiCalendar className="w-6 h-6 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            Attendance
          </span>
        </Link>
        <Link
          to="/fees"
          className="flex flex-col items-center gap-2 p-4 transition-colors bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30"
        >
          <FiDollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Pay Fees
          </span>
        </Link>
        <Link
          to="/grades"
          className="flex flex-col items-center gap-2 p-4 transition-colors bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30"
        >
          <FiBarChart2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
            Grades
          </span>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
