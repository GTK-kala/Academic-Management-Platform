import { Link } from "react-router-dom";
import {
  FiUsers,
  FiBook,
  FiDollarSign,
  FiTrendingUp,
  FiPlus,
  FiEye,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import { fetchRecentStudents } from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);

  const fetchRecentStudentsData = async () => {
    try {
      const response = await fetchRecentStudents();
      setRecentStudents(response.data);
    } catch (error) {
      console.error("Error fetching recent students:", error);
    }
  };
  useEffect(() => {
    fetchRecentStudentsData();
  }, []);

  const statItems = [
    {
      title: "Total Students",
      value: recentStudents.length || 0,
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
      <div className="flex flex-col mb-8 sm:flex-row sm:items-center sm:justify-between">
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
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>
                <p className="mt-2 text-2xl font-bold text-primary dark:text-white">
                  {item.value}
                </p>
                <span className="block mt-1 text-xs text-green-500">
                  {item.change}
                </span>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl">
                <item.icon className="w-6 h-6 text-primary dark:text-primary-300" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Students Table */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Recent Students
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-dark-border">
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
                    <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
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
