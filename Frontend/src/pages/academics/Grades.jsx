import { useState, useEffect } from "react";

import {
  FiBarChart2,
  FiTrendingUp,
  FiAward,
  FiBook,
  FiPlus,
  FiEdit2,
  FiDownload,
} from "react-icons/fi";

import { Link } from "react-router-dom";

import {
  Add_Grade,
  Fetch_ALL_Grades,
  Fetch_Grade_By_Both,
  Fetch_Grade_By_Course,
  Fetch_Grade_By_Student,
  Fetch_Overall_Grade,
} from "../../services/gradeService";

import { useAuth } from "../../context/AuthContext";

import Button from "../../components/common/Button";

import { Get_Courses, Enrolled_Courses } from "../../services/courseService";

import { fetchRecentStudents } from "../../services/studentService";

import toast from "react-hot-toast";

// ======================================================
// GRADES COMPONENT
// ======================================================

const Grades = () => {
  const { user } = useAuth();

  // ======================================================
  // STATE
  // ======================================================

  const [grades, setGrades] = useState([]);

  const [courses, setCourses] = useState([]);

  const [students, setStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("all");

  const [selectedStudent, setSelectedStudent] = useState("all");

  const [loading, setLoading] = useState(true);

  const [showAddGrade, setShowAddGrade] = useState(false);

  // Overall grade
  const [overallGrade, setOverallGrade] = useState(null);

  const [overallLoading, setOverallLoading] = useState(false);

  // ======================================================
  // ADD GRADE FORM
  // ======================================================

  const [gradeForm, setGradeForm] = useState({
    student_id: "",
    course_id: "",
    numeric_grade: "",
    exam_type: "midterm",
    semester: "2025-Spring",
    academic_year: "2025-2026",
    recorded_by: "",
  });

  // ======================================================
  // GRADE DISTRIBUTION
  // ======================================================

  const [gradeDistribution, setGradeDistribution] = useState({});

  // ======================================================
  // EXAM TYPES
  // ======================================================

  const examTypes = ["assignment", "quiz", "project", "midterm", "final"];

  // ======================================================
  // WEIGHTS
  // ======================================================

  const gradeWeights = {
    assignment: 0.1,
    quiz: 0.1,
    project: 0.1,
    midterm: 0.3,
    final: 0.4,
  };

  // ======================================================
  // INITIAL DATA FETCH
  // ======================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
          return;
        }

        // ================================================
        // FETCH COURSES
        // ================================================

        const coursesRes = await Get_Courses(
          storedUser.role,
          storedUser.userId,
        );

        if (storedUser.role === "teacher") {
          const teacherCourses = coursesRes.courses.filter(
            (course) => Number(course.teacher_id) === Number(storedUser.userId),
          );

          setCourses(teacherCourses);
        } else if (storedUser.role === "admin") {
          setCourses(coursesRes.courses || []);
        } else if (storedUser.role === "student") {
          const res = await Enrolled_Courses(
            storedUser.userId,
            storedUser.role,
          );

          setCourses(res.enrollments || []);
        }

        // ================================================
        // FETCH STUDENTS
        // ================================================

        if (storedUser.role !== "student") {
          const studentsRes = await fetchRecentStudents(
            storedUser.userId,
            storedUser.role,
          );

          setStudents(studentsRes.students || []);
        }

        // ================================================
        // FETCH GRADES
        // ================================================

        await fetchGrades();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [user]);

  // ======================================================
  // FETCH GRADES
  // ======================================================

  const fetchGrades = async () => {
    setLoading(true);

    let gradeData = [];

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        return;
      }

      // ================================================
      // COURSE + STUDENT
      // ================================================

      if (selectedCourse !== "all" && selectedStudent !== "all") {
        const res = await Fetch_Grade_By_Both(
          selectedCourse,
          selectedStudent,
          storedUser.role,
        );

        gradeData = res?.grades || [];
      }

      // ================================================
      // COURSE ONLY
      // ================================================
      else if (selectedCourse !== "all" && selectedStudent === "all") {
        const res = await Fetch_Grade_By_Course(
          selectedCourse,
          storedUser.role,
          storedUser.userId,
        );

        gradeData = res?.grades || [];
      }

      // ================================================
      // STUDENT ONLY
      // ================================================
      else if (selectedStudent !== "all" && selectedCourse === "all") {
        const res = await Fetch_Grade_By_Student(
          selectedStudent,
          storedUser.role,
          storedUser.userId,
        );

        gradeData = res?.grades || [];
      }

      // ================================================
      // ALL GRADES
      // ================================================
      else {
        const res = await Fetch_ALL_Grades(storedUser.userId, storedUser.role);

        gradeData = res?.grades || [];
      }

      // ================================================
      // SAVE GRADES
      // ================================================

      setGrades(gradeData);

      // ================================================
      // GRADE DISTRIBUTION
      // ================================================

      const distribution = {
        "A+": 0,
        A: 0,
        "A-": 0,
        "B+": 0,
        B: 0,
        "B-": 0,
        "C+": 0,
        C: 0,
        "C-": 0,
        "D+": 0,
        D: 0,
        F: 0,
      };

      gradeData.forEach((g) => {
        if (Object.prototype.hasOwnProperty.call(distribution, g.grade)) {
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

  // ======================================================
  // REFRESH WHEN FILTER CHANGES
  // ======================================================

  useEffect(() => {
    fetchGrades();
  }, [selectedCourse, selectedStudent]);

  // ======================================================
  // GET LETTER GRADE FROM SCORE
  // ======================================================

  const calculateLetterGrade = (score) => {
    const numericScore = Number(score);

    if (numericScore >= 90) return "A+";
    if (numericScore >= 85) return "A";
    if (numericScore >= 80) return "A-";
    if (numericScore >= 75) return "B+";
    if (numericScore >= 70) return "B";
    if (numericScore >= 65) return "B-";
    if (numericScore >= 60) return "C+";
    if (numericScore >= 55) return "C";
    if (numericScore >= 50) return "C-";
    if (numericScore >= 45) return "D+";
    if (numericScore >= 40) return "D";

    return "F";
  };

  // ======================================================
  // CALCULATE GPA
  // ======================================================

  const calculateGPA = (gradeList) => {
    if (!gradeList.length) {
      return "0.00";
    }

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

    const total = gradeList.reduce(
      (sum, g) => sum + (gradePoints[g.grade] || 0),
      0,
    );

    return (total / gradeList.length).toFixed(2);
  };

  const gpa = calculateGPA(grades);

  // ======================================================
  // GET GRADE COLOR
  // ======================================================

  const getGradeColor = (grade) => {
    if (!grade) {
      return "text-gray-600";
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

  // ======================================================
  // GET GRADE BACKGROUND
  // ======================================================

  const getGradeBg = (grade) => {
    if (!grade) {
      return "bg-gray-100 dark:bg-gray-900/20";
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

  // ======================================================
  // ADD GRADE
  // ======================================================

  const handleAddGrade = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    try {
      // ================================================
      // VALIDATE SCORE
      // ================================================

      const score = Number(gradeForm.numeric_grade);

      if (Number.isNaN(score) || score < 0 || score > 100) {
        toast.error("Score must be between 0 and 100");

        return;
      }

      // ================================================
      // CREATE DATA TO SEND
      // ================================================

      const data = {
        student_id: Number(gradeForm.student_id),

        course_id: Number(gradeForm.course_id),

        numeric_grade: score,

        exam_type: gradeForm.exam_type,

        semester: gradeForm.semester,

        academic_year: gradeForm.academic_year,

        recorded_by: storedUser?.userId || null,
      };

      console.log("Sending grade:", data);

      // ================================================
      // ADD GRADE
      // ================================================

      const GradeRes = await Add_Grade(data, storedUser?.role);

      // ================================================
      // SUCCESS
      // ================================================

      if (GradeRes.success) {
        toast.success(`${gradeForm.exam_type} grade added successfully`);

        console.log("Grade response:", GradeRes);

        // ============================================
        // RESET FORM
        // ============================================

        setGradeForm({
          student_id: "",
          course_id: "",
          numeric_grade: "",
          exam_type: "midterm",
          semester: "2025-Spring",
          academic_year: "2025-2026",
          recorded_by: storedUser?.userId || "",
        });

        setShowAddGrade(false);

        // ============================================
        // REFRESH
        // ============================================

        await fetchGrades();

        // ============================================
        // REFRESH OVERALL GRADE
        // ============================================

        if (selectedStudent !== "all" && selectedCourse !== "all") {
          await fetchOverallGrade(selectedStudent, selectedCourse);
        }
      }
    } catch (error) {
      console.error("Failed to add grade:", error);

      toast.error(error.message || "Failed to add grade");
    }
  };

  // ======================================================
  // FETCH OVERALL GRADE
  // ======================================================

  const fetchOverallGrade = async (studentId, courseId) => {
    try {
      setOverallLoading(true);

      const res = await Fetch_Overall_Grade(studentId, courseId);

      setOverallGrade(res);
    } catch (error) {
      console.error("Failed to fetch overall grade:", error);

      setOverallGrade(null);
    } finally {
      setOverallLoading(false);
    }
  };

  // ======================================================
  // LOAD OVERALL GRADE WHEN BOTH FILTERS ARE SELECTED
  // ======================================================

  useEffect(() => {
    if (selectedStudent !== "all" && selectedCourse !== "all") {
      fetchOverallGrade(selectedStudent, selectedCourse);
    } else {
      setOverallGrade(null);
    }
  }, [selectedStudent, selectedCourse]);

  // ======================================================
  // CHECK WHETHER ALL FIVE ASSESSMENTS EXIST
  // ======================================================

  const hasAllAssessments = (result) => {
    if (!result?.assessments) {
      return false;
    }

    const assessments = result.assessments;

    return (
      assessments.assignment !== null &&
      assessments.quiz !== null &&
      assessments.project !== null &&
      assessments.midterm !== null &&
      assessments.final !== null
    );
  };

  // ======================================================
  // OPEN ADD GRADE MODAL
  // ======================================================

  const openAddGradeModal = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    setGradeForm({
      student_id: selectedStudent !== "all" ? selectedStudent : "",

      course_id: selectedCourse !== "all" ? selectedCourse : "",

      numeric_grade: "",

      exam_type: "midterm",

      semester: "2025-Spring",

      academic_year: "2025-2026",

      recorded_by: storedUser?.userId || "",
    });

    setShowAddGrade(true);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div>
      {/* ==================================================
          HEADER
      ================================================== */}

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
            onClick={openAddGradeModal}
            className="flex items-center gap-2"
          >
            <FiPlus />
            Add Grade
          </Button>
        )}
      </div>

      {/* ==================================================
          STATS
      ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* GPA */}

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

        {/* TOTAL GRADES */}

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Assessments
              </p>

              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {grades.length}
              </p>
            </div>
          </div>
        </div>

        {/* PASSING RATE */}

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
                      (grades.filter((g) => !g.grade?.startsWith("F")).length /
                        grades.length) *
                        100,
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        {/* COURSES */}

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

      {/* ==================================================
          FILTERS
      ================================================== */}

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
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

      {/* ==================================================
          OVERALL COURSE GRADE
      ================================================== */}

      {selectedStudent !== "all" && selectedCourse !== "all" && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Overall Course Grade
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Assignment 10% · Quiz 10% · Project 10% · Midterm 30% · Final
                40%
              </p>
            </div>

            {overallLoading && (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            )}
          </div>

          {!overallLoading && overallGrade && (
            <>
              {/* ASSESSMENT SCORES */}

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {[
                  ["Assignment", "assignment", "10%"],

                  ["Quiz", "quiz", "10%"],

                  ["Project", "project", "10%"],

                  ["Midterm", "midterm", "30%"],

                  ["Final", "final", "40%"],
                ].map(([label, key, weight]) => {
                  const score = overallGrade?.assessments?.[key];

                  return (
                    <div
                      key={key}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {label} ({weight})
                      </p>

                      <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                        {score !== null && score !== undefined
                          ? `${score}%`
                          : "Pending"}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* FINAL RESULT */}

              {hasAllAssessments(overallGrade) ? (
                <div className="flex items-center justify-between p-5 rounded-xl bg-primary/10 border border-primary/20">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Overall Score
                    </p>

                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {overallGrade.overall_score}%
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Final Grade
                    </p>

                    <div
                      className={`mt-1 inline-flex items-center justify-center w-14 h-14 rounded-full text-xl font-bold ${getGradeBg(
                        overallGrade.overall_grade,
                      )} ${getGradeColor(overallGrade.overall_grade)}`}
                    >
                      {overallGrade.overall_grade}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Overall grade is pending. All five assessments must be
                    entered before the final grade can be calculated.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ==================================================
          GRADE DISTRIBUTION
      ================================================== */}

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
                    className={`w-8 text-sm font-medium ${getGradeColor(
                      grade,
                    )}`}
                  >
                    {grade}
                  </span>

                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        grade.startsWith("A")
                          ? "bg-green-500"
                          : grade.startsWith("B")
                            ? "bg-blue-500"
                            : grade.startsWith("C")
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }`}
                      style={{
                        width: `${
                          grades.length ? (count / grades.length) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>

                  <span className="w-12 text-sm text-gray-500 dark:text-gray-400">
                    {count}
                  </span>
                </div>
              ),
          )}
        </div>
      </div>

      {/* ==================================================
          ADD GRADE MODAL
      ================================================== */}

      {showAddGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}

            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Grade
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Enter the numeric score. The letter grade will be calculated
                automatically.
              </p>
            </div>

            {/* FORM */}

            <form onSubmit={handleAddGrade} className="p-6 space-y-4">
              {/* STUDENT */}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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

              {/* NUMERIC SCORE */}

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
                  required
                  onChange={(e) =>
                    setGradeForm({
                      ...gradeForm,
                      numeric_grade: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  placeholder="85.50"
                />

                {gradeForm.numeric_grade !== "" && (
                  <p className="text-sm text-gray-500 mt-1">
                    Letter grade:
                    <span
                      className={`ml-1 font-bold ${getGradeColor(
                        calculateLetterGrade(gradeForm.numeric_grade),
                      )}`}
                    >
                      {calculateLetterGrade(gradeForm.numeric_grade)}
                    </span>
                  </p>
                )}
              </div>

              {/* SEMESTER + YEAR */}

              <div className="grid grid-cols-2 gap-4">
                {/* SEMESTER */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    placeholder="2025-Spring"
                  />
                </div>

                {/* ACADEMIC YEAR */}

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
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                    placeholder="2025-2026"
                  />
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
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

      {/* ==================================================
          GRADES TABLE
      ================================================== */}

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

                <th className="px-6 py-4">Assessment</th>

                <th className="px-6 py-4">Grade</th>

                <th className="px-6 py-4">Score</th>

                <th className="px-6 py-4">Semester</th>

                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-gray-100 dark:divide-dark-border">
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : /* EMPTY */

              grades.length === 0 ? (
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
                /* DATA */

                grades.map((grade) => (
                  <tr
                    key={grade.id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-card/50"
                  >
                    {/* STUDENT */}

                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                      {grade.first_name} {grade.last_name}
                    </td>

                    {/* COURSE */}

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {grade.course_name}
                    </td>

                    {/* EXAM */}

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 capitalize">
                      {grade.exam_type}
                    </td>

                    {/* LETTER GRADE */}

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${getGradeBg(
                          grade.grade,
                        )} ${getGradeColor(grade.grade)}`}
                      >
                        {grade.grade}
                      </span>
                    </td>

                    {/* SCORE */}

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {grade.numeric_grade !== null &&
                      grade.numeric_grade !== undefined
                        ? `${grade.numeric_grade}%`
                        : "N/A"}
                    </td>

                    {/* SEMESTER */}

                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {grade.semester}
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-4">
                      {user?.role !== "student" && (
                        <Link to={`/students/${grade.student_id}`}>
                          <button className="text-primary hover:text-primary-dark">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                        </Link>
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
