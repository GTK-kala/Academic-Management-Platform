import toast from "react-hot-toast";
import { useState, useEffect } from "react";

import {
  FiCalendar,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiDownload,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";

import { Get_Courses, Enrolled_Courses } from "../../services/courseService";

import {
  Add_Attendance,
  Get_Attendances,
} from "../../services/attendanceService";

const Attendance = () => {
  const { user } = useAuth();

  // ========================================
  // STATE
  // ========================================

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("all");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [loading, setLoading] = useState(true);

  const [markingAttendance, setMarkingAttendance] = useState(false);

  const [students, setStudents] = useState([]);

  // Current attendance status
  const [attendanceForm, setAttendanceForm] = useState({});

  // Original attendance status
  const [originalAttendance, setOriginalAttendance] = useState({});

  // ========================================
  // FETCH COURSES
  // ========================================

  useEffect(() => {
    const fetchCourses = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      try {
        const res = await Get_Courses(storedUser?.role, storedUser?.userId);

        const courseData = res?.courses || [];

        if (storedUser?.role === "admin") {
          setCourses(courseData);
        } else if (storedUser?.role === "teacher") {
          const teacherCourses = courseData.filter(
            (course) =>
              course.teacher_name ===
              `${storedUser.firstName} ${storedUser.lastName}`,
          );

          setCourses(teacherCourses);
        } else {
          setCourses(courseData);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);

        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  // ========================================
  // FETCH ATTENDANCE RECORDS
  // ========================================

  useEffect(() => {
    const fetchAttendance = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      setLoading(true);

      try {
        if (selectedCourse === "all" && storedUser.role) {
          const res = await Get_Attendances(
            selectedCourse,
            storedUser?.role,
            storedUser?.userId,
          );

          setAttendanceRecords(res?.attendance || []);
        } else if (selectedCourse !== "all" && storedUser?.role) {
          const res = await Get_Attendances(
            selectedCourse,
            storedUser?.role,
            storedUser?.userId,
          );

          setAttendanceRecords(res?.attendance || []);
        }
      } catch (error) {
        console.error("Failed to fetch attendance:", error);

        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedCourse, selectedDate]);

  // ========================================
  // START MARKING ATTENDANCE
  // ========================================

  const startMarkingAttendance = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (selectedCourse === "all") {
      toast.error("Please select a course first.");

      return;
    }

    setMarkingAttendance(true);

    try {
      const res = await Enrolled_Courses(
        storedUser?.userId,
        storedUser?.role,
        selectedCourse,
      );

      const enrollments = res?.enrollments || [];

      // Only students from selected course
      const courseStudents = enrollments.filter(
        (student) => Number(student.course_id) === Number(selectedCourse),
      );

      setStudents(courseStudents);

      // ========================================
      // INITIALIZE ATTENDANCE
      // ========================================

      const form = {};
      const original = {};

      courseStudents.forEach((student) => {
        const studentId = student.id;

        // Find existing attendance
        const existingAttendance = attendanceRecords.find(
          (record) =>
            Number(record.student_id) === Number(studentId) &&
            Number(record.course_id) === Number(selectedCourse) &&
            record.attendance_date?.split("T")[0] === selectedDate,
        );

        const status = existingAttendance?.status || "present";

        form[studentId] = status;

        original[studentId] = status;
      });

      // Current values
      setAttendanceForm(form);

      // Original values
      setOriginalAttendance(original);
    } catch (error) {
      console.error("Failed to fetch students:", error);

      setStudents([]);
      setAttendanceForm({});
      setOriginalAttendance({});

      toast.error("Failed to fetch students.");
    }
  };

  // ========================================
  // CHANGE STUDENT STATUS
  // ========================================

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceForm((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // ========================================
  // SUBMIT ONLY CHANGED STUDENTS
  // ========================================

  const submitAttendance = async () => {
    try {
      if (selectedCourse === "all") {
        toast.error("Please select a course first.");

        return;
      }

      if (!selectedDate) {
        toast.error("Please select a date.");

        return;
      }

      if (students.length === 0) {
        toast.error("No students are enrolled in this course.");

        return;
      }

      // ========================================
      // FIND ONLY CHANGED STUDENTS
      // ========================================

      const changedStudents = students.filter((student) => {
        const studentId = student.id;

        const oldStatus = originalAttendance[studentId];

        const newStatus = attendanceForm[studentId];

        return oldStatus !== newStatus;
      });

      // ========================================
      // NOTHING CHANGED
      // ========================================

      if (changedStudents.length === 0) {
        toast.error("No attendance changes were made.");

        return;
      }

      // ========================================
      // SEND ONLY CHANGED STUDENTS
      // ========================================

      for (const student of changedStudents) {
        const studentId = student.id;

        const attendanceData = {
          student_id: Number(studentId),

          course_id: Number(selectedCourse),

          attendance_date: selectedDate,

          recorded_by: Number(user?.userId),

          status: attendanceForm[studentId],
        };

        // ONE request for this student
        await Add_Attendance(attendanceData);
      }

      // ========================================
      // SUCCESS
      // ========================================

      toast.success(
        `${changedStudents.length} attendance record${
          changedStudents.length > 1 ? "s" : ""
        } updated successfully!`,
      );

      // ========================================
      // UPDATE ORIGINAL VALUES
      // ========================================

      setOriginalAttendance((prev) => {
        const updated = {
          ...prev,
        };

        changedStudents.forEach((student) => {
          updated[student.id] = attendanceForm[student.id];
        });

        return updated;
      });

      // Close form
      setMarkingAttendance(false);

      setAttendanceForm({});

      // ========================================
      // REFRESH ATTENDANCE
      // ========================================

      const res = await Get_Attendances(
        selectedCourse,
        selectedDate,
        user?.role,
      );

      setAttendanceRecords(res?.attendance || []);
    } catch (error) {
      console.error("Failed to record attendance:", error);

      toast.error(
        "Failed to record attendance: " +
          (error?.response?.data?.message || error?.message || "Unknown error"),
      );
    }
  };

  // ========================================
  // CANCEL
  // ========================================

  const cancelMarkingAttendance = () => {
    setMarkingAttendance(false);

    setStudents([]);

    setAttendanceForm({});

    setOriginalAttendance({});
  };

  // ========================================
  // STATISTICS
  // ========================================

  const stats = {
    total: attendanceRecords.length,

    present: attendanceRecords.filter((record) => record.status === "present")
      .length,

    absent: attendanceRecords.filter((record) => record.status === "absent")
      .length,

    late: attendanceRecords.filter((record) => record.status === "late").length,

    excused: attendanceRecords.filter((record) => record.status === "excused")
      .length,
  };

  const attendancePercentage =
    stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  // ========================================
  // JSX
  // ========================================

  return (
    <div>
      {/* ========================================
          HEADER
      ======================================== */}

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
            <FiCheck />
            Mark Attendance
          </Button>
        )}
      </div>

      {/* ========================================
          FILTERS
      ======================================== */}

      <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* COURSE */}

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

          {/* DATE */}

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

      {/* ========================================
          STATISTICS
      ======================================== */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* PRESENT */}

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

        {/* ABSENT */}

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

        {/* LATE */}

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

        {/* EXCUSED */}

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

      {/* ========================================
          PROGRESS
      ======================================== */}

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
            style={{
              width: `${attendancePercentage}%`,
            }}
          />
        </div>
      </div>

      {/* ========================================
          MARK ATTENDANCE
      ======================================== */}

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
                    key={student.id}
                    className="border-b border-gray-100 dark:border-dark-border"
                  >
                    <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">
                      {student.first_name} {student.last_name}
                    </td>

                    <td className="py-3 pr-4">
                      <select
                        value={attendanceForm[student.id] || "present"}
                        onChange={(e) =>
                          handleAttendanceChange(student.id, e.target.value)
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

          {/* BUTTONS */}

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="secondary" onClick={cancelMarkingAttendance}>
              Cancel
            </Button>

            <Button onClick={submitAttendance}>Save Attendance</Button>
          </div>
        </div>
      )}

      {/* ========================================
          ATTENDANCE RECORDS
      ======================================== */}

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
              <FiDownload className="w-4 h-4" />
              Export
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
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto" />
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
                    key={record.id || idx}
                    className="hover:bg-gray-50 dark:hover:bg-dark-card/50"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {record.first_name} {record.last_name}
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {record.course_name || `Course #${record.course_id}`}
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {record.attendance_date
                        ? new Date(record.attendance_date).toLocaleDateString()
                        : "-"}
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
                        {record.status
                          ? record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)
                          : "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      Teacher ID: {record.recorded_by || "-"}
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
