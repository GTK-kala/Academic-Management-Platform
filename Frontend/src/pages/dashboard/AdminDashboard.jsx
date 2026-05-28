import { Link } from "react-router-dom";
import {
  FiUsers,
  FiBook,
  FiDollarSign,
  FiTrendingUp,
  FiPlus,
  FiEye,
} from "react-icons/fi";
import api from "../../services/api";
import { useState, useEffect } from "react";
import Button from "../../components/common/Button";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);

  // useEffect(() => {
  //   const fetchDashboard = async () => {
  //     try {
  //       // In real app you'd have a /api/admin/dashboard endpoint; for now we call separate services
  //       const [studentRes, courseRes] = await Promise.all([
  //         api.get("/students"),
  //         api.get("/courses"),
  //       ]);
  //       // Derive stats from returned arrays (simplified)
  //       const totalStudents = studentRes.data?.students?.length || 0;
  //       const totalCourses = courseRes.data?.courses?.length || 0;
  //       setStats({
  //         totalStudents,
  //         totalCourses,
  //         feeCollected: "$0", // you'll implement fee stats later
  //         attendanceRate: "0%",
  //       });
  //       setRecentStudents(studentRes.data?.students?.slice(0, 5) || []);
  //     } catch (err) {
  //       console.error("Dashboard fetch error:", err);
  //     }
  //   };
  //   fetchDashboard();
  // }, []);

  const statItems = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: FiUsers,
      change: "+12%",
    },
    {
      title: "Active Courses",
      value: stats?.totalCourses || 0,
      icon: FiBook,
      change: "+3",
    },
    {
      title: "Fee Collected",
      value: stats?.feeCollected || "$0",
      icon: FiDollarSign,
      change: "+22%",
    },
    {
      title: "Attendance Rate",
      value: stats?.attendanceRate || "0%",
      icon: FiTrendingUp,
      change: "+1.2%",
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-white">
          Admin Dashboard
        </h1>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Link to="/students/add">
            <Button className="flex items-center gap-2">
              <FiPlus /> Add Student
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline" className="flex items-center gap-2">
              <FiEye /> View Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>
                <p className="text-2xl font-bold text-primary dark:text-white mt-2">
                  {item.value}
                </p>
                <span className="text-xs text-green-500 mt-1 block">
                  {item.change}
                </span>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary dark:text-primary-300" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Students Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Students
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-dark-border">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Enrollment Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 dark:border-dark-border"
                >
                  <td className="py-3 pr-4 text-gray-900 dark:text-white">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                    {student.email}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                    {new Date(student.enrollment_date).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
              {recentStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Link
            to="/students"
            className="text-sm text-primary dark:text-primary-300 hover:underline"
          >
            View all students →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
