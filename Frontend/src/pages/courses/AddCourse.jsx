import api from "../../services/api";
import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import { FiArrowLeft, FiSave, FiX } from "react-icons/fi";
import { useNavigate, useParams, Link } from "react-router-dom";

const AddCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If id exists, we're in edit mode
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [teachers, setTeachers] = useState([]);

  // Form state
  const [form, setForm] = useState({
    course_code: "",
    course_name: "",
    description: "",
    credits: 3,
    teacher_id: "",
    max_capacity: 30,
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Fetch teachers for dropdown and course data if editing
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch teachers
        const teachersRes = await api.get("/teachers");
        setTeachers(teachersRes.data?.teachers || []);

        // If editing, fetch course data
        if (isEditMode) {
          const courseRes = await api.get(`/courses/${id}`);
          const courseData = courseRes.data?.course;

          if (courseData) {
            setForm({
              course_code: courseData.course_code || "",
              course_name: courseData.course_name || "",
              description: courseData.description || "",
              credits: courseData.credits || 3,
              teacher_id: courseData.teacher_id || "",
              max_capacity: courseData.max_capacity || 30,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load required data. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!form.course_code.trim()) {
      errors.course_code = "Course code is required";
    } else if (form.course_code.length < 2 || form.course_code.length > 20) {
      errors.course_code = "Course code must be between 2 and 20 characters";
    }

    if (!form.course_name.trim()) {
      errors.course_name = "Course name is required";
    } else if (form.course_name.length < 3) {
      errors.course_name = "Course name must be at least 3 characters";
    }

    if (!form.description.trim()) {
      errors.description = "Course description is required";
    } else if (form.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!form.credits || form.credits < 1 || form.credits > 10) {
      errors.credits = "Credits must be between 1 and 10";
    }

    if (!form.teacher_id) {
      errors.teacher_id = "Please select a teacher";
    }

    if (
      !form.max_capacity ||
      form.max_capacity < 1 ||
      form.max_capacity > 500
    ) {
      errors.max_capacity = "Capacity must be between 1 and 500";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setError("Please fix the errors below before submitting.");
      return;
    }

    setLoading(true);

    try {
      const courseData = {
        course_code: form.course_code.trim(),
        course_name: form.course_name.trim(),
        description: form.description.trim(),
        credits: parseInt(form.credits),
        teacher_id: form.teacher_id ? parseInt(form.teacher_id) : null,
        max_capacity: parseInt(form.max_capacity),
      };

      if (isEditMode) {
        // Update existing course
        await api.put(`/courses/${id}`, courseData);
        setSuccess("Course updated successfully!");
      } else {
        // Create new course
        await api.post("/courses", courseData);
        setSuccess("Course created successfully!");
      }

      // Reset form or redirect
      setTimeout(() => {
        navigate("/courses");
      }, 1500);
    } catch (error) {
      console.error("Failed to save course:", error);

      if (
        error.message?.includes("Duplicate") ||
        error.message?.includes("already exists")
      ) {
        setFormErrors({
          ...formErrors,
          course_code: "This course code already exists",
        });
        setError(
          "A course with this code already exists. Please use a different code.",
        );
      } else {
        setError(error.message || "Failed to save course. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (form.course_code || form.course_name || form.description) {
      if (
        window.confirm(
          "Are you sure you want to cancel? All changes will be lost.",
        )
      ) {
        navigate("/courses");
      }
    } else {
      navigate("/courses");
    }
  };

  // Loading state while fetching course data for edit
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300 transition-colors mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Courses</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-white">
          {isEditMode ? "Edit Course" : "Add New Course"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {isEditMode
            ? "Update the course details below"
            : "Fill in the details to create a new course"}
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 flex items-center gap-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 md:p-8">
          {/* Basic Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Code */}
              <div>
                <label
                  htmlFor="course_code"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Course Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="course_code"
                  name="course_code"
                  value={form.course_code}
                  onChange={handleChange}
                  placeholder="e.g., CS101, MATH201"
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    formErrors.course_code
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500"
                      : "border-gray-300 dark:border-dark-border"
                  }`}
                  disabled={isEditMode} // Can't change course code when editing
                />
                {formErrors.course_code && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.course_code}
                  </p>
                )}
                {isEditMode && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Course code cannot be changed after creation
                  </p>
                )}
              </div>

              {/* Credits */}
              <div>
                <label
                  htmlFor="credits"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Credits <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  value={form.credits}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    formErrors.credits
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500"
                      : "border-gray-300 dark:border-dark-border"
                  }`}
                />
                {formErrors.credits && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.credits}
                  </p>
                )}
              </div>
            </div>

            {/* Course Name */}
            <div className="mt-6">
              <label
                htmlFor="course_name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="course_name"
                name="course_name"
                value={form.course_name}
                onChange={handleChange}
                placeholder="e.g., Introduction to Computer Science"
                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                  formErrors.course_name
                    ? "border-red-300 dark:border-red-700 focus:ring-red-500"
                    : "border-gray-300 dark:border-dark-border"
                }`}
              />
              {formErrors.course_name && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.course_name}
                </p>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </span>
              Course Description
            </h2>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="Provide a detailed description of the course content, objectives, and prerequisites..."
                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none ${
                  formErrors.description
                    ? "border-red-300 dark:border-red-700 focus:ring-red-500"
                    : "border-gray-300 dark:border-dark-border"
                }`}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.description}
                </p>
              )}
              <div className="mt-1 flex justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Provide a clear description of what students will learn
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {form.description.length} characters
                </p>
              </div>
            </div>
          </div>

          {/* Assignment Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </span>
              Course Assignment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teacher Assignment */}
              <div>
                <label
                  htmlFor="teacher_id"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Assign Teacher <span className="text-red-500">*</span>
                </label>
                <select
                  id="teacher_id"
                  name="teacher_id"
                  value={form.teacher_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    formErrors.teacher_id
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500"
                      : "border-gray-300 dark:border-dark-border"
                  }`}
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                      {teacher.department ? ` (${teacher.department})` : ""}
                    </option>
                  ))}
                </select>
                {formErrors.teacher_id && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.teacher_id}
                  </p>
                )}
                {teachers.length === 0 && (
                  <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                    No teachers available.{" "}
                    <Link to="/register" className="underline">
                      Register a teacher first
                    </Link>
                  </p>
                )}
              </div>

              {/* Maximum Capacity */}
              <div>
                <label
                  htmlFor="max_capacity"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Maximum Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="max_capacity"
                  name="max_capacity"
                  value={form.max_capacity}
                  onChange={handleChange}
                  min="1"
                  max="500"
                  placeholder="30"
                  className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    formErrors.max_capacity
                      ? "border-red-300 dark:border-red-700 focus:ring-red-500"
                      : "border-gray-300 dark:border-dark-border"
                  }`}
                />
                {formErrors.max_capacity && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.max_capacity}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Maximum number of students that can enroll in this course
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-dark-border">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 order-2 sm:order-1"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  {isEditMode ? "Update Course" : "Create Course"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Quick Tips Sidebar (visible on larger screens) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
            💡 Course Code Tips
          </h3>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Use department prefix (e.g., CS, MATH)</li>
            <li>• Follow with course level (e.g., 101, 201)</li>
            <li>• Keep it short and unique</li>
          </ul>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">
            📝 Description Tips
          </h3>
          <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
            <li>• Include learning objectives</li>
            <li>• List prerequisites if any</li>
            <li>• Mention assessment methods</li>
          </ul>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
          <h3 className="font-medium text-purple-700 dark:text-purple-300 mb-2">
            👥 Capacity Tips
          </h3>
          <ul className="text-sm text-purple-600 dark:text-purple-400 space-y-1">
            <li>• Lab courses: 20-30 students</li>
            <li>• Lecture courses: 50-100 students</li>
            <li>• Online courses: up to 500</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
