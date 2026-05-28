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
        const coursesRes = await api.get("/courses");
        const courseData = coursesRes.data?.courses || [];
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            Courses
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
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
      <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
        <div className="text-center py-12 bg-white dark:bg-dark-card rounded-xl shadow-sm">
          <FiBookOpen className="mx-auto w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search terms"
              : "No courses available at the moment"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-all duration-200 group"
            >
              {/* Course Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary dark:text-primary-300">
                    {course.course_code}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {course.credits} credits
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {course.course_name}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                  {course.description || "No description available"}
                </p>

                {/* Teacher Info */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
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
              <div className="px-6 py-4 bg-gray-50 dark:bg-dark-bg rounded-b-xl border-t border-gray-100 dark:border-dark-border">
                {user?.role === "student" ? (
                  enrolledCourseIds.includes(course.id) ? (
                    <button
                      disabled
                      className="w-full py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                      ✓ Enrolled
                    </button>
                  ) : (course.enrolled_count || 0) >=
                    (course.max_capacity || 30) ? (
                    <button
                      disabled
                      className="w-full py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                      Course Full
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Enroll Now
                    </button>
                  )
                ) : (
                  <Link
                    to={`/courses/${course.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2 text-primary dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg text-sm font-medium transition-colors"
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
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredCourses.length} of {courses.length} courses
      </div>
    </div>
  );
};

export default CourseList;
