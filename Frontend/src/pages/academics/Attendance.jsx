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
        } else if (storedUser?.role === "student") {
          const studentCourses = await Enrolled_Courses(
            storedUser?.userId,
            storedUser?.role,
            selectedCourse,
          );

          const enrolledCourseData = studentCourses?.enrollments || [];

          setCourses(enrolledCourseData);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
      }
    };

    fetchCourses();
  }, [selectedCourse]);

  // ========================================
  // FETCH ATTENDANCE RECORDS
  // ========================================

  useEffect(() => {
    const fetchAttendance = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      setLoading(true);

      try {
        if (selectedCourse === "all" && storedUser?.role) {
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
  // MARK ALL PRESENT
  // ========================================

  const handleMarkAllPresent = () => {
    if (students.length === 0) {
      toast.error("No students loaded.");
      return;
    }

    const updatedForm = {};

    students.forEach((student) => {
      updatedForm[student.id] = "present";
    });

    setAttendanceForm(updatedForm);

    toast.success("All students marked as present.");
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

      setLoading(true);

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

      // ========================================
      // CLOSE FORM
      // ========================================

      setMarkingAttendance(false);
      setAttendanceForm({});

      // ========================================
      // REFRESH ATTENDANCE
      // ========================================

      const res = await Get_Attendances(
        selectedCourse,
        user?.role,
        user?.userId,
      );

      setAttendanceRecords(res?.attendance || []);
    } catch (error) {
      console.error("Failed to record attendance:", error);

      toast.error(
        "Failed to record attendance: " +
          (error?.response?.data?.message || error?.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
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
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 mb-8 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            Attendance
          </h1>

          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage and track student attendance
          </p>
        </div>
      </div>

      {/* FILTERS */}

      <div className="w-full min-w-0 p-4 mb-6 overflow-hidden bg-white border border-gray-100 shadow-sm sm:p-6 dark:bg-dark-card rounded-xl dark:border-dark-border">
        <div className="flex flex-col w-full min-w-0 gap-4 sm:flex-row">
          {/* COURSE */}

          <div className="w-full min-w-0 sm:flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Course
            </label>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="block w-full min-w-0 max-w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg box-border dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
            >
              <option value="all">Select Course</option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}

          <div className="w-full min-w-0 sm:flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="block w-full min-w-0 max-w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg box-border dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* STATISTICS */}

      <div className="grid w-full min-w-0 grid-cols-2 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL */}

        <div className="min-w-0 p-4 overflow-hidden bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Students
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900 truncate dark:text-white">
              {students.length}
            </p>
          </div>
        </div>

        {/* PRESENT */}

        <div className="min-w-0 p-4 overflow-hidden bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Present</p>

            <p className="mt-1 text-2xl font-bold text-green-600 truncate">
              {stats.present}
            </p>
          </div>
        </div>

        {/* LATE */}

        <div className="min-w-0 p-4 overflow-hidden bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Late</p>

            <p className="mt-1 text-2xl font-bold text-yellow-600 truncate">
              {stats.late}
            </p>
          </div>
        </div>

        {/* ABSENT */}

        <div className="min-w-0 p-4 overflow-hidden bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Absent</p>

            <p className="mt-1 text-2xl font-bold text-red-600 truncate">
              {stats.absent}
            </p>
          </div>
        </div>
      </div>

      {/* ATTENDANCE PROGRESS */}

      <div className="w-full min-w-0 p-4 mb-6 overflow-hidden bg-white border border-gray-100 shadow-sm sm:p-6 dark:bg-dark-card rounded-xl dark:border-dark-border">
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Attendance Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Overall attendance for the selected course
            </p>
          </div>

          <div className="text-2xl font-bold text-primary">
            {attendancePercentage}%
          </div>
        </div>

        <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full dark:bg-dark-bg">
          <div
            className="h-full transition-all duration-300 bg-primary"
            style={{
              width: `${attendancePercentage}%`,
            }}
          />
        </div>
      </div>

      {/* MARK ATTENDANCE */}

      <div className="w-full min-w-0 p-4 mb-6 overflow-hidden bg-white border border-gray-100 shadow-sm sm:p-6 dark:bg-dark-card rounded-xl dark:border-dark-border">
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Mark Attendance
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select the attendance status for each student
            </p>
          </div>

          <div className="flex flex-col w-full gap-2 sm:w-auto sm:flex-row">
            <Button onClick={handleMarkAllPresent} className="w-full sm:w-auto">
              Mark All Present
            </Button>

            <Button
              onClick={submitAttendance}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </div>

        {/* STUDENT TABLE */}

        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-border">
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 dark:text-gray-300">
                  Student
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 dark:text-gray-300">
                  Student ID
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 dark:border-dark-border"
                >
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    {student.first_name} {student.last_name}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {student.id}
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={attendanceForm[student.id] || "present"}
                      onChange={(e) =>
                        handleAttendanceChange(student.id, e.target.value)
                      }
                      className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white"
                    >
                      <option value="present">Present</option>

                      <option value="late">Late</option>

                      <option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ATTENDANCE RECORDS */}

      <div className="w-full min-w-0 p-4 overflow-hidden bg-white border border-gray-100 shadow-sm sm:p-6 dark:bg-dark-card rounded-xl dark:border-dark-border">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Attendance Records
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View previously recorded attendance
          </p>
        </div>

        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-border">
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 whitespace-nowrap dark:text-gray-300">
                  Student
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 whitespace-nowrap dark:text-gray-300">
                  Course
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 whitespace-nowrap dark:text-gray-300">
                  Date
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 whitespace-nowrap dark:text-gray-300">
                  Status
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 whitespace-nowrap dark:text-gray-300">
                  Recorded By
                </th>
              </tr>
            </thead>

            <tbody>
              {attendanceRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-100 dark:border-dark-border"
                >
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                    {record.student_name}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
                    {record.course_name}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
                    {record.attendance_date}
                  </td>

                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        record.status === "present"
                          ? "bg-green-100 text-green-700"
                          : record.status === "late"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap dark:text-gray-400">
                    {record.recorded_by_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
