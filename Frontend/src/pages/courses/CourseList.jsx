import api from "../../services/api";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import Button from "../../components/common/Button";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const data = await api.get("/courses");
      setCourses(data.data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.course_name.toLowerCase().includes(search.toLowerCase()) ||
      c.course_code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary dark:text-white">
          Courses
        </h1>
        {/* Only admin can add course; we conditionally show button later but for now show for all */}
        <Button className="flex items-center gap-2">
          <FiPlus /> Add Course
        </Button>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs text-primary dark:text-primary-300 font-mono bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                    {course.course_code}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
                    {course.course_name}
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  {course.credits} credits
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {course.teacher_first} {course.teacher_last || "Unassigned"}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Capacity: {course.max_capacity}
                </span>
                <button className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors">
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
