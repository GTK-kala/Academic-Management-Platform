import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  FiBookOpen,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiArrowRight,
  FiCheckCircle,
  FiStar,
  FiShield,
  FiMousePointer,
} from "react-icons/fi";

const stats = [
  { icon: FiUsers, value: "10K+", label: "Active Students" },
  { icon: FiBookOpen, value: "200+", label: "Courses" },
  { icon: FiDollarSign, value: "98%", label: "Fee Collection" },
  { icon: FiTrendingUp, value: "4.9", label: "User Rating" },
];

const features = [
  {
    icon: FiMousePointer,
    title: "One‑Click Enroll",
    desc: "Students enroll in courses with a single tap – no paperwork, no delays.",
  },
  {
    icon: FiShield,
    title: "Role‑Based Access",
    desc: "Separate dashboards for admins, teachers, and students with fine‑grained controls.",
  },
  {
    icon: FiCheckCircle,
    title: "Smart Fee Tracking",
    desc: "Automated fee statuses, partial payments, and overdue alerts.",
  },
  {
    icon: FiStar,
    title: "Academic Insights",
    desc: "Real‑time attendance, grades, and performance analytics.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Sign Up",
    desc: "Create your account as admin, teacher, or student.",
  },
  {
    step: "02",
    title: "Set Up Courses",
    desc: "Admins add courses, assign teachers, and define fees.",
  },
  {
    step: "03",
    title: "Enroll & Learn",
    desc: "Students enroll, pay fees, and attend classes.",
  },
  {
    step: "04",
    title: "Track Progress",
    desc: "Teachers mark attendance, grades, and monitor performance.",
  },
];

const testimonials = [
  {
    quote:
      "“ AcadManage transformed our entire admission workflow. Highly recommended!”",
    name: "Sarah K.",
    role: "Principal, Greenfield Academy",
  },
  {
    quote: "“ The fee tracking alone saved us 20 hours a week of manual work.”",
    name: "James L.",
    role: "Bursar, Tech Valley School",
  },
  {
    quote:
      "“ Finally, a system that my teachers actually enjoy using. Clean and intuitive.”",
    name: "Maria G.",
    role: "Head of Academics",
  },
];

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg overflow-x-hidden">
      {/* ========== HERO ========== */}
      <section className="relative px-4 pt-10 pb-10 md:pt-32 md:pb-32 bg-gradient-to-br from-primary-50 via-white to-white dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/20 text-primary dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            New: Advanced Analytics just launched
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary dark:text-white leading-tight max-w-4xl">
            The Smarter Way to{" "}
            <span className="text-primary dark:text-primary-300 underline decoration-primary decoration-4 underline-offset-8">
              Manage
            </span>{" "}
            Your Academy
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl">
            From enrollment to graduation — one unified platform for students,
            teachers, and administrators.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="group px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40"
            >
              Start Free Today{" "}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-primary text-primary dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-card font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Live Demo
            </Link>
          </div>
        </div>
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* ========== STATS COUNTER ========== */}
      <section className="py-16 px-4 bg-white dark:bg-dark-bg border-y border-gray-100 dark:border-dark-border">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 mb-3">
                <stat.icon className="w-6 h-6 text-primary dark:text-primary-300" />
              </div>
              <div className="text-3xl font-bold text-primary dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-20 px-4 bg-primary-50 dark:bg-dark-card/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary dark:text-white mb-6">
            Everything in One Place
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-14">
            Powerful tools designed specifically for educational institutions.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-dark-bg p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feat.icon className="w-6 h-6 text-primary dark:text-primary-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS (timeline) ========== */}
      <section className="py-20 px-4 bg-white dark:bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary dark:text-white mb-14">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line (hidden on mobile) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 dark:bg-dark-border -z-0"></div>
            {howItWorks.map((item, idx) => (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-20 px-4 bg-primary-50 dark:bg-dark-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary dark:text-white mb-12">
            Loved by Educators
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-dark-bg p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border"
              >
                <div className="text-primary dark:text-primary-300 text-4xl mb-4">
                  “
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {t.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="py-16 px-4 bg-primary dark:bg-primary-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            Join 200+ institutions already on AcadManage
          </h2>
          <p className="mt-4 text-white/80 text-lg">
            Start your free trial today — no credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Create Account <FiArrowRight />
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">AcadManage</h3>
            <p className="text-sm">
              Modern student management system for forward‑thinking academies.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Updates
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-8 border-t border-gray-800 dark:border-dark-border text-center text-sm">
          © 2025 Khalid. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
