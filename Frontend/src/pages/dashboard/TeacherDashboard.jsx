import api from "../../services/api";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiBook, FiUsers, FiCalendar, FiBarChart2 } from "react-icons/fi";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await api.get("/courses");
        const courses = coursesRes.data?.courses || [];
        // Filter courses assigned to this teacher (in real app, use teacher_id)
        const assignedCourses = courses
          .filter((c) => c.teacher_first || c.teacher_last)
          .slice(0, 4);
        setMyCourses(assignedCourses);

        // Count total students (simplified)
        const enrollmentsRes = await api.get("/enrollments");
        setTotalStudents(enrollmentsRes.data?.enrollments?.length || 0);

        // Today's classes (placeholder)
        setTodayClasses(assignedCourses.slice(0, 2));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-white">
          Welcome back, Professor {user?.email?.split("@")[0]}!
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Here's your teaching overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                My Courses
              </p>
              <p className="mt-2 text-2xl font-bold text-primary dark:text-white">
                {myCourses.length}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <FiBook className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Students
              </p>
              <p className="mt-2 text-2xl font-bold text-primary dark:text-white">
                {totalStudents}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Today's Classes
              </p>
              <p className="mt-2 text-2xl font-bold text-primary dark:text-white">
                {todayClasses.length}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <FiCalendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Link
          to="/courses"
          className="flex flex-col items-center gap-2 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl"
        >
          <FiBook className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium text-primary">My Courses</span>
        </Link>
        <Link
          to="/attendance"
          className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
        >
          <FiCalendar className="w-6 h-6 text-green-600" />
          <span className="text-sm font-medium text-green-600">
            Mark Attendance
          </span>
        </Link>
        <Link
          to="/grades"
          className="flex flex-col items-center gap-2 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl"
        >
          <FiBarChart2 className="w-6 h-6 text-orange-600" />
          <span className="text-sm font-medium text-orange-600">
            Enter Grades
          </span>
        </Link>
        <Link
          to="/students"
          className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
        >
          <FiUsers className="w-6 h-6 text-purple-600" />
          <span className="text-sm font-medium text-purple-600">Students</span>
        </Link>
      </div>
    </div>
  );
};

export default TeacherDashboard;
