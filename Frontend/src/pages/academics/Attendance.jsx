import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiSearch,
  FiDownload,
} from "react-icons/fi";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";

const Attendance = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({});

  // Fetch courses for filter
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data?.courses || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch attendance records
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        let endpoint = "/attendance";
        const params = [];

        if (selectedCourse !== "all") {
          params.push(`course_id=${selectedCourse}`);
        }
        if (selectedDate) {
          params.push(`date=${selectedDate}`);
        }

        if (params.length > 0) {
          endpoint += `?${params.join("&")}`;
        }

        const res = await api.get(endpoint);
        setAttendanceRecords(res.data?.attendance || []);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedCourse, selectedDate]);

  // Fetch students for marking attendance
  const startMarkingAttendance = async () => {
    setMarkingAttendance(true);
    try {
      // Get enrolled students for selected course
      const res = await api.get(`/enrollments?course_id=${selectedCourse}`);
      const enrollments = res.data?.enrollments || [];
      setStudents(enrollments);

      // Initialize attendance form
      const form = {};
      enrollments.forEach((enrollment) => {
        form[enrollment.student_id] = "present";
      });
      setAttendanceForm(form);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  // Submit attendance
  const submitAttendance = async () => {
    try {
      const promises = Object.entries(attendanceForm).map(
        ([studentId, status]) => {
          return api.post("/attendance", {
            student_id: parseInt(studentId),
            course_id: parseInt(selectedCourse),
            attendance_date: selectedDate,
            status: status,
          });
        },
      );

      await Promise.all(promises);
      alert("Attendance recorded successfully!");
      setMarkingAttendance(false);

      // Refresh attendance records
      const res = await api.get(
        `/attendance?course_id=${selectedCourse}&date=${selectedDate}`,
      );
      setAttendanceRecords(res.data?.attendance || []);
    } catch (error) {
      alert("Failed to record attendance: " + error.message);
    }
  };

  // Calculate attendance statistics
  const stats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter((r) => r.status === "present").length,
    absent: attendanceRecords.filter((r) => r.status === "absent").length,
    late: attendanceRecords.filter((r) => r.status === "late").length,
    excused: attendanceRecords.filter((r) => r.status === "excused").length,
  };

  const attendancePercentage =
    stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            Attendance
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === "teacher"
              ? "Mark and view attendance for your courses"
              : "View your attendance records"}
          </p>
        </div>
        {user?.role === "teacher" && !markingAttendance && (
          <Button
            onClick={startMarkingAttendance}
            className="flex items-center gap-2"
          >
            <FiCheck /> Mark Attendance
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name} ({course.course_code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Attendance Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Present
              </p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">
                {stats.present}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
              <FiX className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">Absent</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">
                {stats.absent}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
              <FiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Late
              </p>
              <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.late}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Excused
              </p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {stats.excused}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Progress Bar */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Attendance
          </h3>
          <span className="text-2xl font-bold text-primary">
            {attendancePercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${attendancePercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Mark Attendance Form (Teacher Only) */}
      {markingAttendance && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mark Attendance - {selectedDate}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-dark-border">
                  <th className="pb-3 pr-4">Student</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.student_id}
                    className="border-b border-gray-100 dark:border-dark-border"
                  >
                    <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={attendanceForm[student.student_id] || "present"}
                        onChange={(e) =>
                          setAttendanceForm({
                            ...attendanceForm,
                            [student.student_id]: e.target.value,
                          })
                        }
                        className="px-3 py-1.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => setMarkingAttendance(false)}
            >
              Cancel
            </Button>
            <Button onClick={submitAttendance}>Save Attendance</Button>
          </div>
        </div>
      )}

      {/* Attendance Records Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
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
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : attendanceRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FiCalendar className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-dark-card/50"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {record.first_name} {record.last_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {record.course_name || `Course #${record.course_id}`}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(record.attendance_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === "present"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            : record.status === "absent"
                              ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                              : record.status === "late"
                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      Teacher ID: {record.recorded_by}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
