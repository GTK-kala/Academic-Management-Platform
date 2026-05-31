import { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiUsers,
  FiBookOpen,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import api from "../../services/api";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Get_Courses } from "../../services/courseService";

const CourseList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [loading, setLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch all courses
        const coursesRes = await Get_Courses();
        const courseData = coursesRes?.courses || [];
        setCourses(courseData);
        setFilteredCourses(courseData);

        // If student, fetch their enrollments
        if (user?.role === "student") {
          const enrollmentsRes = await api.get("/enrollments");
          const enrollments = enrollmentsRes.data?.enrollments || [];
          setEnrolledCourseIds(enrollments.map((e) => e.course_id));
        }
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Search and filter logic
  useEffect(() => {
    let result = courses;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (course) =>
          course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (course.description &&
            course.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      );
    }

    // Filter by department (using teacher's department if available)
    if (selectedDepartment !== "all") {
      result = result.filter(
        (course) => course.teacher_department === selectedDepartment,
      );
    }

    setFilteredCourses(result);
  }, [searchTerm, selectedDepartment, courses]);

  // Get unique departments for filter
  const departments = [
    "all",
    ...new Set(courses.map((c) => c.teacher_department).filter(Boolean)),
  ];

  const handleEnroll = async (courseId) => {
    try {
      await api.post("/enrollments", {
        student_id: user?.id, // In real app, get from profile
        course_id: courseId,
      });
      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
      alert("Successfully enrolled!");
    } catch (error) {
      alert("Enrollment failed: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            Courses
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {user?.role === "admin"
              ? "Manage all courses"
              : user?.role === "teacher"
                ? "Your assigned courses"
                : "Browse and enroll in courses"}
          </p>
        </div>
        {user?.role === "admin" && (
          <Link to="/courses/add">
            <Button className="flex items-center gap-2">
              <FiPlus /> Add Course
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search courses by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {departments.length > 1 && (
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Departments</option>
              {departments
                .filter((d) => d !== "all")
                .map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="py-12 text-center bg-white shadow-sm dark:bg-dark-card rounded-xl">
          <FiBookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No courses found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search terms"
              : "No courses available at the moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="transition-all duration-200 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border hover:shadow-md group"
            >
              {/* Course Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary dark:text-primary-300">
                    {course.course_code}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <FiClock className="w-3 h-3" />
                    {course.credits} credits
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors dark:text-white group-hover:text-primary">
                  {course.course_name}
                </h3>

                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {course.description || "No description available"}
                </p>

                {/* Teacher Info */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700">
                    <FiUsers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {course.teacher_first
                        ? `${course.teacher_first} ${course.teacher_last || ""}`
                        : "Unassigned"}
                    </p>
                    {course.teacher_department && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {course.teacher_department}
                      </p>
                    )}
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    <FiUsers className="inline w-4 h-4 mr-1" />
                    {course.enrolled_count || 0}/{course.max_capacity || 30}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (course.enrolled_count || 0) >=
                      (course.max_capacity || 30)
                        ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    }`}
                  >
                    {(course.enrolled_count || 0) >= (course.max_capacity || 30)
                      ? "Full"
                      : "Available"}
                  </span>
                </div>
              </div>

              {/* Card Footer with Actions */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 dark:bg-dark-bg rounded-b-xl dark:border-dark-border">
                {user?.role === "student" ? (
                  enrolledCourseIds.includes(course.id) ? (
                    <button
                      disabled
                      className="w-full py-2 text-sm font-medium text-green-600 bg-green-100 rounded-lg cursor-not-allowed dark:bg-green-900/20 dark:text-green-400"
                    >
                      ✓ Enrolled
                    </button>
                  ) : (course.enrolled_count || 0) >=
                    (course.max_capacity || 30) ? (
                    <button
                      disabled
                      className="w-full py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed dark:bg-gray-700"
                    >
                      Course Full
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="w-full py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark"
                    >
                      Enroll Now
                    </button>
                  )
                ) : (
                  <Link
                    to={`/courses/${course.id}`}
                    className="flex items-center justify-center w-full gap-2 py-2 text-sm font-medium transition-colors rounded-lg text-primary dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  >
                    View Details <FiArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
        Showing {filteredCourses.length} of {courses.length} courses
      </div>
    </div>
  );
};

export default CourseList;
