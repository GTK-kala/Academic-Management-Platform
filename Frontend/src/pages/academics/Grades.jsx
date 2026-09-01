import { useEffect, useState } from "react";

import {
  FiBarChart2,
  FiTrendingUp,
  FiAward,
  FiBook,
  FiPlus,
  FiDownload,
  FiEdit2,
} from "react-icons/fi";

import { Link } from "react-router-dom";

import {
  Add_Grade,
  Fetch_ALL_Grades,
  Fetch_Grade_By_Both,
  Fetch_Grade_By_Course,
  Fetch_Grade_By_Student,
} from "../../services/gradeService";

import { Get_Courses, Enrolled_Courses } from "../../services/courseService";

import { fetchRecentStudents } from "../../services/studentService";

import { useAuth } from "../../context/AuthContext";

import Button from "../../components/common/Button";

import toast from "react-hot-toast";

const Grades = () => {
  const { user } = useAuth();

  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showAddGrade, setShowAddGrade] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("all");

  const [gradeForm, setGradeForm] = useState({
    student_id: "",
    course_id: "",
    numeric_grade: "",
    exam_type: "assignment",
    semester: "2025-Spring",
    academic_year: "2025-2026",
  });

  const [gradeDistribution, setGradeDistribution] = useState({});

  const examTypes = ["assignment", "quiz", "project", "midterm", "final"];

  const calculateLetterGrade = (score) => {
    const value = Number(score);

    if (value >= 90) return "A+";
    if (value >= 85) return "A";
    if (value >= 80) return "A-";
    if (value >= 75) return "B+";
    if (value >= 70) return "B";
    if (value >= 65) return "B-";
    if (value >= 60) return "C+";
    if (value >= 55) return "C";
    if (value >= 50) return "C-";
    if (value >= 45) return "D+";
    if (value >= 40) return "D";

    return "F";
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
          return;
        }

        if (storedUser.role === "student") {
          const response = await Enrolled_Courses(
            storedUser.userId,
            storedUser.role,
          );

          setCourses(response?.enrollments || []);
        } else if (storedUser?.role === "admin") {
          const response = await Get_Courses(
            storedUser.role,
            storedUser.userId,
          );

          setCourses(response?.courses || []);
        } else if (storedUser?.role === "teacher") {
          const response = await Get_Courses(
            storedUser.role,
            storedUser.userId,
          );

          const teacherCourses = response?.courses.filter(
            (c) => c.teacher_id === storedUser?.userId,
          );

          setCourses(teacherCourses || []);
        }

        if (storedUser.role !== "student") {
          const response = await fetchRecentStudents(
            storedUser.userId,
            storedUser.role,
          );

          setStudents(response?.students || response?.student || []);
        }
      } catch (error) {
        console.error("Failed to load data:", error);

        toast.error("Failed to load courses and students");
      }
    };

    loadData();
  }, [user]);

  const fetchGrades = async () => {
    try {
      setLoading(true);

      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        return;
      }

      let response;

      if (selectedCourse !== "all" && selectedStudent !== "all") {
        response = await Fetch_Grade_By_Both(
          selectedCourse,
          selectedStudent,
          storedUser.role,
        );
      } else if (selectedCourse !== "all") {
        response = await Fetch_Grade_By_Course(
          selectedCourse,
          storedUser.role,
          storedUser.userId,
        );
      } else if (selectedStudent !== "all") {
        response = await Fetch_Grade_By_Student(
          selectedStudent,
          storedUser.role,
          storedUser.userId,
        );
      } else {
        response = await Fetch_ALL_Grades(storedUser.userId, storedUser.role);
      }

      const data = response?.grades || [];

      setGrades(data);

      const distribution = {};

      data.forEach((item) => {
        if (item.grade) {
          distribution[item.grade] = (distribution[item.grade] || 0) + 1;
        }
      });

      setGradeDistribution(distribution);
    } catch (error) {
      console.error("Failed to fetch grades:", error);

      toast.error(error.message || "Failed to fetch grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedCourse, selectedStudent, user]);

  const calculateGPA = () => {
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
      F: 0,
    };

    const completed = grades.filter((item) => item.grade);

    if (completed.length === 0) {
      return "0.00";
    }

    const total = completed.reduce(
      (sum, item) => sum + (gradePoints[item.grade] || 0),
      0,
    );

    return (total / completed.length).toFixed(2);
  };

  const completedGrades = grades.filter((item) => item.grade);

  const passedGrades = completedGrades.filter((item) => item.grade !== "F");

  const passingRate = completedGrades.length
    ? Math.round((passedGrades.length / completedGrades.length) * 100)
    : 0;

  const getGradeColor = (grade) => {
    if (!grade) {
      return "text-gray-400";
    }

    if (grade.startsWith("A")) {
      return "text-green-600 dark:text-green-400";
    }

    if (grade.startsWith("B")) {
      return "text-blue-600 dark:text-blue-400";
    }

    if (grade.startsWith("C")) {
      return "text-yellow-600 dark:text-yellow-400";
    }

    if (grade.startsWith("D")) {
      return "text-orange-600 dark:text-orange-400";
    }

    return "text-red-600 dark:text-red-400";
  };

  const getGradeBackground = (grade) => {
    if (!grade) {
      return "bg-gray-100 dark:bg-gray-800";
    }

    if (grade.startsWith("A")) {
      return "bg-green-100 dark:bg-green-900/20";
    }

    if (grade.startsWith("B")) {
      return "bg-blue-100 dark:bg-blue-900/20";
    }

    if (grade.startsWith("C")) {
      return "bg-yellow-100 dark:bg-yellow-900/20";
    }

    if (grade.startsWith("D")) {
      return "bg-orange-100 dark:bg-orange-900/20";
    }

    return "bg-red-100 dark:bg-red-900/20";
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        toast.error("User is not logged in");
        return;
      }

      const score = Number(gradeForm.numeric_grade);

      if (Number.isNaN(score) || score < 0 || score > 100) {
        toast.error("Score must be between 0 and 100");
        return;
      }

      if (!gradeForm.student_id) {
        toast.error("Please select a student");
        return;
      }

      if (!gradeForm.course_id) {
        toast.error("Please select a course");
        return;
      }

      const data = {
        student_id: Number(gradeForm.student_id),
        course_id: Number(gradeForm.course_id),
        numeric_grade: score,
        exam_type: gradeForm.exam_type,
        semester: gradeForm.semester,
        academic_year: gradeForm.academic_year,
        recorded_by: Number(storedUser.userId),
      };

      console.log("Sending grade:", data);

      const response = await Add_Grade(data, storedUser.role);

      console.log("Grade response:", response);

      if (response?.success) {
        if (
          response.overall_score !== null &&
          response.overall_score !== undefined
        ) {
          toast.success(
            `Grade saved. Overall: ${response.overall_score} (${response.grade})`,
          );
        } else {
          toast.success(`${gradeForm.exam_type} score saved successfully`);
        }

        setGradeForm({
          student_id: "",
          course_id: "",
          numeric_grade: "",
          exam_type: "assignment",
          semester: "2025-Spring",
          academic_year: "2025-2026",
        });

        setShowAddGrade(false);

        await fetchGrades();
      } else {
        toast.error(response?.message || "Failed to save grade");
      }
    } catch (error) {
      console.error("Error adding grade:", error);

      toast.error(error.message || "Failed to save grade");
    }
  };

  const openAddGrade = () => {
    setGradeForm({
      student_id: selectedStudent !== "all" ? selectedStudent : "",

      course_id: selectedCourse !== "all" ? selectedCourse : "",

      numeric_grade: "",
      exam_type: "assignment",
      semester: "2025-Spring",
      academic_year: "2025-2026",
    });

    setShowAddGrade(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            Grades
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage student assessment scores and overall grades.
          </p>
        </div>

        {user?.role !== "student" && (
          <Button onClick={openAddGrade} className="flex items-center gap-2">
            <FiPlus />
            Add Grade
          </Button>
        )}
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* GPA */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20">
              <FiAward className="w-6 h-6 text-primary" />
            </div>

            <div>
              <p className="text-sm text-gray-500">GPA</p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {calculateGPA()}
              </p>
            </div>
          </div>
        </div>

        {/* COURSES */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full dark:bg-green-900/20">
              <FiBook className="w-6 h-6 text-green-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Courses</p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(grades.map((item) => item.course_id)).size}
              </p>
            </div>
          </div>
        </div>

        {/* PASSING RATE */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full dark:bg-blue-900/20">
              <FiTrendingUp className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Passing Rate</p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {passingRate}%
              </p>
            </div>
          </div>
        </div>

        {/* RECORDS */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full dark:bg-purple-900/20">
              <FiBarChart2 className="w-6 h-6 text-purple-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Grade Records</p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {grades.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="p-4 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
        <div
          className={`grid grid-cols-1 ${
            user?.role !== "student" ? "md:grid-cols-2" : ""
          } gap-4`}
        >
          {/* COURSE */}
          <div
            className={user?.role === "student" ? "w-full md:col-span-2" : ""}
          >
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Course
            </label>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
            >
              <option value="all">All Courses</option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          {/* STUDENT */}
          {user?.role !== "student" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Student
              </label>

              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
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

      {/* GRADE DISTRIBUTION */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Grade Distribution
        </h3>

        {Object.keys(gradeDistribution).length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No completed grades yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div
                key={grade}
                className={`px-4 py-2 rounded-lg ${getGradeBackground(grade)}`}
              >
                <span className={`font-bold ${getGradeColor(grade)}`}>
                  {grade}
                </span>

                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  {count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD GRADE MODAL */}
      {showAddGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Grade
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter one assessment score. The overall grade is calculated
                after all five scores are entered.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleAddGrade} className="p-6 space-y-4">
              {/* STUDENT */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student
                </label>

                <select
                  value={gradeForm.student_id}
                  onChange={(e) =>
                    setGradeForm({
                      ...gradeForm,
                      student_id: e.target.value,
                    })
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

              {/* COURSE */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course
                </label>

                <select
                  value={gradeForm.course_id}
                  onChange={(e) =>
                    setGradeForm({
                      ...gradeForm,
                      course_id: e.target.value,
                    })
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

              {/* EXAM TYPE */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assessment Type
                </label>

                <select
                  value={gradeForm.exam_type}
                  onChange={(e) =>
                    setGradeForm({
                      ...gradeForm,
                      exam_type: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                >
                  {examTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* SCORE */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Score
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
                  required
                  placeholder="Enter score"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />

                {gradeForm.numeric_grade !== "" && (
                  <p className="mt-2 text-sm text-gray-500">
                    Current letter:
                    <span
                      className={`ml-2 font-bold ${getGradeColor(
                        calculateLetterGrade(gradeForm.numeric_grade),
                      )}`}
                    >
                      {calculateLetterGrade(gradeForm.numeric_grade)}
                    </span>
                  </p>
                )}
              </div>

              {/* SEMESTER */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Semester
                </label>

                <input
                  type="text"
                  value={gradeForm.semester}
                  onChange={(e) =>
                    setGradeForm({
                      ...gradeForm,
                      semester: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>

              {/* ACADEMIC YEAR */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddGrade(false)}
                >
                  Cancel
                </Button>

                <Button type="submit">Save Grade</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADE RECORDS */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Grade Records
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                One row contains all assessments for one student and course.
              </p>
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              <FiDownload />
              Export
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left">
            {/* HEADER */}
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4 text-center">Assignment</th>
                <th className="px-5 py-4 text-center">Quiz</th>
                <th className="px-5 py-4 text-center">Project</th>
                <th className="px-5 py-4 text-center">Midterm</th>
                <th className="px-5 py-4 text-center">Final</th>
                <th className="px-5 py-4 text-center">Overall</th>
                <th className="px-5 py-4 text-center">Grade</th>
                <th className="px-5 py-4 text-center">Status</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center">
                    <div className="w-8 h-8 mx-auto border-t-2 border-b-2 rounded-full animate-spin border-primary" />
                  </td>
                </tr>
              ) : grades.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    <FiBarChart2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    No grade records found.
                  </td>
                </tr>
              ) : (
                grades.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-bg/50"
                  >
                    {/* STUDENT */}
                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {item.first_name} {item.last_name}
                    </td>

                    {/* COURSE */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.course_name}
                      </div>

                      <div className="text-xs text-gray-500">
                        {item.course_code}
                      </div>
                    </td>

                    {/* ASSIGNMENT */}
                    <td className="px-5 py-4 text-center">
                      {item.assignment !== null
                        ? `${Number(item.assignment)}%`
                        : "—"}
                    </td>

                    {/* QUIZ */}
                    <td className="px-5 py-4 text-center">
                      {item.quiz !== null ? `${Number(item.quiz)}%` : "—"}
                    </td>

                    {/* PROJECT */}
                    <td className="px-5 py-4 text-center">
                      {item.project !== null ? `${Number(item.project)}%` : "—"}
                    </td>

                    {/* MIDTERM */}
                    <td className="px-5 py-4 text-center">
                      {item.midterm !== null ? `${Number(item.midterm)}%` : "—"}
                    </td>

                    {/* FINAL */}
                    <td className="px-5 py-4 text-center">
                      {item.final !== null ? `${Number(item.final)}%` : "—"}
                    </td>

                    {/* OVERALL */}
                    <td className="px-5 py-4 font-bold text-center">
                      {item.overall_score !== null
                        ? `${Number(item.overall_score).toFixed(2)}%`
                        : "Pending"}
                    </td>

                    {/* GRADE */}
                    <td className="px-5 py-4 text-center">
                      {item.grade ? (
                        <span
                          className={`inline-flex items-center justify-center w-11 h-11 rounded-full font-bold ${getGradeBackground(
                            item.grade,
                          )} ${getGradeColor(item.grade)}`}
                        >
                          {item.grade}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4 text-center">
                      {item.grade ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                          Pending
                        </span>
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
