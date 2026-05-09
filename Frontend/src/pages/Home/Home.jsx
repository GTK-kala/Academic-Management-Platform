import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  FiBookOpen,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiArrowRight,
} from "react-icons/fi";

const features = [
  {
    icon: FiUsers,
    title: "Student Management",
    description:
      "Manage student profiles, enrollments, and academic records effortlessly.",
  },
  {
    icon: FiBookOpen,
    title: "Course Management",
    description:
      "Create and assign courses, manage teachers, and set capacities.",
  },
  {
    icon: FiDollarSign,
    title: "Fee Tracking",
    description:
      "Track fee structures, payments, and generate financial reports.",
  },
  {
    icon: FiTrendingUp,
    title: "Academic Workflow",
    description:
      "Record attendance, grades, and view academic progress at a glance.",
  },
];

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-bg">
      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 md:pt-32 md:pb-28">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary dark:text-white leading-tight">
            Manage Your{" "}
            <span className="text-primary dark:text-primary-300">Academy</span>{" "}
            with Ease
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A full‑stack student management system with role‑based access,
            course enrollment, fee tracking, and academic workflows.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              Get Started <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 border border-primary text-primary dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-card rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary dark:text-white mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-md border border-gray-100 dark:border-dark-border hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon className="w-6 h-6 text-primary dark:text-primary-300 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer / Call to Action --- */}
      <section className="bg-primary dark:bg-primary-900 py-12 px-4 mt-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to get started?
          </h2>
          <p className="mt-3 opacity-90">
            Join hundreds of institutions already using AcadManage.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sign Up Free <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
