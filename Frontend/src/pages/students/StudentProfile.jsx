import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiBook,
  FiDollarSign,
  FiBarChart2,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiActivity,
} from "react-icons/fi";
import api from "../../services/api";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { Fetch_Student } from "../../services/studentService";
import { Enrolled_Courses } from "../../services/courseService";
import { Get_Attendances } from "../../services/attendanceService";
import { Fetch_Grade_By_Student } from "../../services/gradeService";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [student, setStudent] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [gradeRecords, setGradeRecords] = useState([]);
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all student data
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch basic student info
        const user = JSON.parse(localStorage.getItem("user"));
        const studentRes = await Fetch_Student(id, user?.role);
        const studentData = studentRes?.student || studentRes.data;
        setStudent(studentData);

        // Fetch enrolled courses
        const enrollmentsRes = await Enrolled_Courses(id, "student");
        const enrollments = enrollmentsRes?.enrollments || [];
        setEnrolledCourses(enrollments);

        // // Fetch attendance records
        const attendanceRes = await Get_Attendances("all", "student", id);
        setAttendanceRecords(attendanceRes?.attendance || []);

        // // Fetch grades
        const gradesRes = await Fetch_Grade_By_Student(
          id,
          "student",
          user?.userId,
        );
        setGradeRecords(gradesRes?.grades || []);

        // // Fetch fee payments
        // const feesRes = await api.get(`/fees/payments?student_id=${id}`);
        // setFeeRecords(feesRes.data?.payments || []);
      } catch (err) {
        console.error("Failed to fetch student data:", err);
        setError(err.message || "Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);

  // Handle student deletion
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/students/${id}`);
      navigate("/students");
    } catch (err) {
      console.error("Failed to delete student:", err);
      alert("Failed to delete student: " + err.message);
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalAttendance = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(
      (r) => r.status === "present",
    ).length;
    const attendanceRate =
      totalAttendance > 0
        ? Math.round((presentCount / totalAttendance) * 100)
        : 0;

    const totalFees = feeRecords.reduce(
      (sum, fee) => sum + (fee.total_due || fee.amount || 0),
      0,
    );
    const paidFees = feeRecords.reduce(
      (sum, fee) => sum + (fee.amount_paid || 0),
      0,
    );
    const pendingFees = totalFees - paidFees;

    const averageGrade =
      gradeRecords.length > 0
        ? (
            gradeRecords.reduce((sum, g) => sum + (g.numeric_grade || 0), 0) /
            gradeRecords.length
          ).toFixed(1)
        : 0;

    return {
      attendanceRate,
      totalFees,
      paidFees,
      pendingFees,
      averageGrade,
      totalCourses: enrolledCourses.length,
      totalGrades: gradeRecords.length,
      totalAttendance,
      presentCount,
    };
  };

  const stats = calculateStats();

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      active:
        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      completed:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      dropped: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      present:
        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      absent: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      late: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      excused:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      paid: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      partial:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      pending:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      overdue: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[status] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
      >
        {status}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Loading student profile...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-20">
        <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Error Loading Profile
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <Link
          to="/students"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiArrowLeft /> Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/students")}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Students</span>
        </button>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {user?.role === "admin" && (
            <>
              <Link to={`/students/edit/${id}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <FiEdit2 className="w-4 h-4" /> Edit
                </Button>
              </Link>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
            <span className="text-4xl font-bold text-primary dark:text-primary-300">
              {student?.first_name?.[0] || "S"}
              {student?.last_name?.[0] || ""}
            </span>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-primary dark:text-white">
                {student?.first_name} {student?.last_name}
              </h1>
              <StatusBadge status="active" />
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FiMail className="w-4 h-4 text-primary" />
                <span>{student?.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FiPhone className="w-4 h-4 text-primary" />
                <span>{student?.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FiCalendar className="w-4 h-4 text-primary" />
                <span>
                  Enrolled:{" "}
                  {student?.enrollment_date
                    ? new Date(student.enrollment_date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              {student?.address && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FiMapPin className="w-4 h-4 text-primary" />
                  <span>{student.address}</span>
                </div>
              )}
              {student?.gender && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FiUser className="w-4 h-4 text-primary" />
                  <span className="capitalize">{student.gender}</span>
                </div>
              )}
            </div>
          </div>

          {/* GPA Circle */}
          <div className="text-center flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <div>
                <p className="text-3xl font-bold text-white">
                  {stats.averageGrade}
                </p>
                <p className="text-xs text-white/80">Avg Grade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FiBook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enrolled Courses
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalCourses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Attendance Rate
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.attendanceRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pending Fees
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${stats.pendingFees}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <FiBarChart2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total Grades
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalGrades}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="border-b border-gray-200 dark:border-dark-border">
          <nav className="flex overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: FiActivity },
              { id: "courses", label: "Courses", icon: FiBook },
              { id: "attendance", label: "Attendance", icon: FiCalendar },
              { id: "grades", label: "Grades", icon: FiBarChart2 },
              { id: "fees", label: "Fees", icon: FiDollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary dark:text-primary-300"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-gray-500 dark:text-gray-400">
                        Full Name
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {student?.first_name} {student?.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-gray-500 dark:text-gray-400">
                        Email
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {student?.email}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-gray-500 dark:text-gray-400">
                        Phone
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {student?.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-gray-500 dark:text-gray-400">
                        Gender
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {student?.gender || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Enrollment Date
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {student?.enrollment_date
                          ? new Date(
                              student.enrollment_date,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Academic Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-gray-500 dark:text-gray-400">
                        Total Courses
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {stats.totalCourses}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-gray-500 dark:text-gray-400">
                        Attendance Rate
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {stats.attendanceRate}%
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                      <span className="text-gray-500 dark:text-gray-400">
                        Average Grade
                      </span>
                      <span className="font-medium text-primary dark:text-primary-300">
                        {stats.averageGrade}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Overall Status
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        Good Standing
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === "courses" && (
            <div>
              {enrolledCourses.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-dark-border">
                        <th className="pb-3 pr-4">Course Code</th>
                        <th className="pb-3 pr-4">Course Name</th>
                        <th className="pb-3 pr-4">Enrollment Date</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-dark-border">
                      {enrolledCourses.map((course, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-dark-bg"
                        >
                          <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                            {course.course_code || "N/A"}
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {course.course_name}
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {course.enrollment_date
                              ? new Date(
                                  course.enrollment_date,
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="py-3">
                            <StatusBadge status={course.status || "active"} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiBook className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No enrolled courses
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === "attendance" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Attendance Records
                </h3>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm"
                >
                  <FiDownload className="w-4 h-4" /> Export
                </Button>
              </div>
              {attendanceRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-dark-border">
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Course</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-dark-border">
                      {attendanceRecords.map((record, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-dark-bg"
                        >
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {new Date(
                              record.attendance_date,
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {record.course_name ||
                              `Course #${record.course_id}`}
                          </td>
                          <td className="py-3">
                            <StatusBadge status={record.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiCalendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No attendance records
                  </p>
                </div>
              )}
            </div>
          )}

          {/* GRADES TAB */}
          {activeTab === "grades" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Grade Records
                </h3>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm"
                >
                  <FiDownload className="w-4 h-4" /> Export
                </Button>
              </div>
              {gradeRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-dark-border">
                        <th className="pb-3 pr-4">Course</th>
                        <th className="pb-3 pr-4">Over All</th>
                        <th className="pb-3 pr-4">Grade</th>
                        <th className="pb-3 pr-4">Score</th>
                        <th className="pb-3">Semester</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-dark-border">
                      {gradeRecords.map((grade, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-dark-bg"
                        >
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {grade.course_name || `Course #${grade.course_id}`}
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300 capitalize">
                            {grade.overall_score}
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                                grade.grade?.startsWith("A")
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                  : grade.grade?.startsWith("B")
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    : grade.grade?.startsWith("C")
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                              }`}
                            >
                              {grade.grade || "N/A"}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {grade.overall_score
                              ? `${grade.overall_score} %`
                              : "N/A"}
                          </td>
                          <td className="py-3 text-gray-600 dark:text-gray-300">
                            {grade.semester || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiBarChart2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No grade records
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FEES TAB */}
          {activeTab === "fees" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Fee Records
                </h3>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-sm"
                >
                  <FiDownload className="w-4 h-4" /> Export
                </Button>
              </div>
              {feeRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-dark-border">
                        <th className="pb-3 pr-4">Fee Name</th>
                        <th className="pb-3 pr-4">Total Due</th>
                        <th className="pb-3 pr-4">Amount Paid</th>
                        <th className="pb-3 pr-4">Payment Date</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-dark-border">
                      {feeRecords.map((fee, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-dark-bg"
                        >
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {fee.fee_name || "N/A"}
                          </td>
                          <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                            ${fee.total_due || fee.amount || 0}
                          </td>
                          <td className="py-3 pr-4 text-green-600 dark:text-green-400 font-medium">
                            ${fee.amount_paid || 0}
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {fee.payment_date
                              ? new Date(fee.payment_date).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="py-3">
                            <StatusBadge status={fee.status || "pending"} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiDollarSign className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No fee records
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delete Student
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete{" "}
                <strong>
                  {student?.first_name} {student?.last_name}
                </strong>
                ? This action cannot be undone and will remove all associated
                records.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete Student"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
