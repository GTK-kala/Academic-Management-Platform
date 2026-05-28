import { useState, useEffect } from "react";
import {
  FiBarChart2,
  FiTrendingUp,
  FiAward,
  FiBook,
  FiSearch,
  FiPlus,
  FiEdit2,
  FiDownload,
} from "react-icons/fi";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";

const Grades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAddGrade, setShowAddGrade] = useState(false);

  // Add Grade Form
  const [gradeForm, setGradeForm] = useState({
    student_id: "",
    course_id: "",
    grade: "A",
    numeric_grade: "",
    exam_type: "midterm",
    semester: "2025-Spring",
    academic_year: "2025-2026",
  });

  // Grade distribution for chart
  const [gradeDistribution, setGradeDistribution] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesRes = await api.get("/courses");
        setCourses(coursesRes.data?.courses || []);

        // Fetch students (if admin/teacher)
        if (user?.role !== "student") {
          const studentsRes = await api.get("/students");
          setStudents(studentsRes.data?.students || []);
        }

        // Fetch grades
        await fetchGrades();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [user]);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      let endpoint = "/grades";
      const params = [];

      if (selectedCourse !== "all") {
        params.push(`course_id=${selectedCourse}`);
      }
      if (selectedStudent !== "all") {
        params.push(`student_id=${selectedStudent}`);
      }

      if (params.length > 0) {
        endpoint += `?${params.join("&")}`;
      }

      const res = await api.get(endpoint);
      const gradeData = res.data?.grades || [];
      setGrades(gradeData);

      // Calculate grade distribution
      const distribution = {
        A: 0,
        "A-": 0,
        "B+": 0,
        B: 0,
        "B-": 0,
        "C+": 0,
        C: 0,
        "C-": 0,
        D: 0,
        F: 0,
      };
      gradeData.forEach((g) => {
        if (distribution.hasOwnProperty(g.grade)) {
          distribution[g.grade]++;
        }
      });
      setGradeDistribution(distribution);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedCourse, selectedStudent]);

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      await api.post("/grades", gradeForm);
      alert("Grade added successfully!");
      setShowAddGrade(false);
      setGradeForm({
        student_id: "",
        course_id: "",
        grade: "A",
        numeric_grade: "",
        exam_type: "midterm",
        semester: "2025-Spring",
        academic_year: "2025-2026",
      });
      fetchGrades();
    } catch (error) {
      alert("Failed to add grade: " + error.message);
    }
  };

  // Calculate GPA
  const calculateGPA = (grades) => {
    if (grades.length === 0) return 0;

    const gradePoints = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      F: 0.0,
    };

    const total = grades.reduce(
      (sum, g) => sum + (gradePoints[g.grade] || 0),
      0,
    );
    return (total / grades.length).toFixed(2);
  };

  const gpa = calculateGPA(grades);

  // Find grade color
  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "text-green-600 dark:text-green-400";
    if (grade.startsWith("B")) return "text-blue-600 dark:text-blue-400";
    if (grade.startsWith("C")) return "text-yellow-600 dark:text-yellow-400";
    if (grade.startsWith("D")) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getGradeBg = (grade) => {
    if (grade.startsWith("A")) return "bg-green-100 dark:bg-green-900/20";
    if (grade.startsWith("B")) return "bg-blue-100 dark:bg-blue-900/20";
    if (grade.startsWith("C")) return "bg-yellow-100 dark:bg-yellow-900/20";
    if (grade.startsWith("D")) return "bg-orange-100 dark:bg-orange-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  const examTypes = ["midterm", "final", "assignment", "quiz", "project"];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            Grades
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === "teacher"
              ? "Manage grades for your students"
              : "View your academic performance"}
          </p>
        </div>
        {user?.role !== "student" && (
          <Button
            onClick={() => setShowAddGrade(true)}
            className="flex items-center gap-2"
          >
            <FiPlus /> Add Grade
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <FiAward className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">GPA</p>
              <p className="text-2xl font-bold text-primary dark:text-white">
                {gpa}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Grades
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {grades.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FiBarChart2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Passing Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {grades.length > 0
                  ? Math.round(
                      (grades.filter((g) => !g.grade.startsWith("F")).length /
                        grades.length) *
                        100,
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <FiBook className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Courses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(grades.map((g) => g.course_id)).size}
              </p>
            </div>
          </div>
        </div>
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
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>
          {user?.role !== "student" && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Students</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Grade Distribution Chart */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Grade Distribution
        </h3>
        <div className="space-y-3">
          {Object.entries(gradeDistribution).map(
            ([grade, count]) =>
              count > 0 && (
                <div key={grade} className="flex items-center gap-3">
                  <span
                    className={`w-8 text-sm font-medium ${getGradeColor(grade)}`}
                  >
                    {grade}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${grade.startsWith("A") ? "bg-green-500" : grade.startsWith("B") ? "bg-blue-500" : grade.startsWith("C") ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${(count / grades.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-sm text-gray-500 dark:text-gray-400">
                    {count}
                  </span>
                </div>
              ),
          )}
        </div>
      </div>

      {/* Add Grade Modal */}
      {showAddGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Grade
              </h3>
            </div>
            <form onSubmit={handleAddGrade} className="p-6 space-y-4">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Student
                </label>
                <select
                  value={gradeForm.student_id}
                  onChange={(e) =>
                    setGradeForm({ ...gradeForm, student_id: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.first_name} {student.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course
                </label>
                <select
                  value={gradeForm.course_id}
                  onChange={(e) =>
                    setGradeForm({ ...gradeForm, course_id: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Exam Type
                </label>
                <select
                  value={gradeForm.exam_type}
                  onChange={(e) =>
                    setGradeForm({ ...gradeForm, exam_type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                >
                  {examTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Letter Grade
                  </label>
                  <select
                    value={gradeForm.grade}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, grade: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  >
                    {[
                      "A+",
                      "A",
                      "A-",
                      "B+",
                      "B",
                      "B-",
                      "C+",
                      "C",
                      "C-",
                      "D+",
                      "D",
                      "F",
                    ].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Numeric Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={gradeForm.numeric_grade}
                    onChange={(e) =>
                      setGradeForm({
                        ...gradeForm,
                        numeric_grade: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                    placeholder="85.50"
                  />
                </div>
              </div>

              {/* Semester & Academic Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={gradeForm.semester}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, semester: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={gradeForm.academic_year}
                    onChange={(e) =>
                      setGradeForm({
                        ...gradeForm,
                        academic_year: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddGrade(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Grade</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grades Table */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
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
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Exam Type</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : grades.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FiBarChart2 className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    No grade records found
                  </td>
                </tr>
              ) : (
                grades.map((grade, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-dark-card/50"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {grade.first_name} {grade.last_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {grade.course_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 capitalize">
                      {grade.exam_type}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${getGradeBg(grade.grade)} ${getGradeColor(grade.grade)}`}
                      >
                        {grade.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {grade.numeric_grade ? `${grade.numeric_grade}%` : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {grade.semester}
                    </td>
                    <td className="px-6 py-4">
                      {user?.role !== "student" && (
                        <button className="text-primary hover:text-primary-dark">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      )}
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

export default Grades;
