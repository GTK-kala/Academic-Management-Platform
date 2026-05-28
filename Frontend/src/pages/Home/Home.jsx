import { Link } from "react-router-dom";
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
import { useTheme } from "../../context/ThemeContext";

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
    <div className="min-h-screen overflow-x-hidden bg-white dark:bg-dark-bg">
      {/* ========== HERO ========== */}
      <section className="relative px-4 pt-10 pb-10 md:pt-32 md:pb-32 bg-gradient-to-br from-primary-50 via-white to-white dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg">
        <div className="flex flex-col items-center mx-auto text-center max-w-7xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary dark:text-primary-300">
            <span className="relative flex w-3 h-3">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span>
              <span className="relative inline-flex w-3 h-3 rounded-full bg-primary"></span>
            </span>
            New: Advanced Analytics just launched
          </div>
          <h1 className="max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl text-primary dark:text-white">
            The Smarter Way to{" "}
            <span className="underline text-primary dark:text-primary-300 decoration-primary decoration-4 underline-offset-8">
              Manage
            </span>{" "}
            Your Academy
          </h1>
          <p className="max-w-3xl mt-6 text-xl text-gray-600 md:text-2xl dark:text-gray-300">
            From enrollment to graduation — one unified platform for students,
            teachers, and administrators.
          </p>
          <div className="flex flex-col gap-4 mt-10 sm:flex-row">
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-4 font-semibold text-white transition-all shadow-lg group bg-primary hover:bg-primary-dark rounded-xl shadow-primary/25 hover:shadow-primary/40"
            >
              Start Free Today{" "}
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-8 py-4 font-semibold transition-colors border-2 border-primary text-primary dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-card rounded-xl"
            >
              Live Demo
            </Link>
          </div>
        </div>
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 rounded-full w-96 h-96 bg-primary/10 dark:bg-primary/5 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 rounded-full w-80 h-80 bg-primary/10 dark:bg-primary/5 blur-3xl -z-10"></div>
      </section>

      {/* ========== STATS COUNTER ========== */}
      <section className="px-4 py-16 bg-white border-gray-100 dark:bg-dark-bg border-y dark:border-dark-border">
        <div className="grid max-w-6xl grid-cols-2 gap-6 mx-auto md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-xl bg-primary-100 dark:bg-primary-900/20">
                <stat.icon className="w-6 h-6 text-primary dark:text-primary-300" />
              </div>
              <div className="text-3xl font-bold text-primary dark:text-white">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="px-4 py-20 bg-primary-50 dark:bg-dark-card/30">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-3xl font-bold text-center md:text-4xl text-primary dark:text-white">
            Everything in One Place
          </h2>
          <p className="max-w-2xl mx-auto text-center text-gray-500 dark:text-gray-400 mb-14">
            Powerful tools designed specifically for educational institutions.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm group dark:bg-dark-bg rounded-2xl dark:border-dark-border hover:shadow-md"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-5 transition-transform bg-primary-100 dark:bg-primary-900/20 rounded-xl group-hover:scale-110">
                  <feat.icon className="w-6 h-6 text-primary dark:text-primary-300" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS (timeline) ========== */}
      <section className="px-4 py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center md:text-4xl text-primary dark:text-white mb-14">
            How It Works
          </h2>
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Connector line (hidden on mobile) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 dark:bg-dark-border -z-0"></div>
            {howItWorks.map((item, idx) => (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 text-lg font-bold text-white rounded-full shadow-md bg-primary">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="px-4 py-20 bg-primary-50 dark:bg-dark-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl text-primary dark:text-white">
            Loved by Educators
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-8 bg-white border border-gray-100 shadow-sm dark:bg-dark-bg rounded-2xl dark:border-dark-border"
              >
                <div className="mb-4 text-4xl text-primary dark:text-primary-300">
                  “
                </div>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-primary">
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
      <section className="px-4 py-16 bg-primary dark:bg-primary-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold md:text-4xl">
            Join 200+ institutions already on AcadManage
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Start your free trial today — no credit card required.
          </p>
          <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold transition-colors bg-white text-primary rounded-xl hover:bg-gray-100"
            >
              Create Account <FiArrowRight />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center px-8 py-3 font-semibold text-white transition-colors border-2 border-white rounded-xl hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="px-4 py-12 text-gray-400 bg-gray-900 dark:bg-gray-950">
        <div className="grid grid-cols-1 gap-8 mx-auto max-w-7xl md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">AcadManage</h3>
            <p className="text-sm">
              Modern student management system for forward‑thinking academies.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-medium text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="transition-colors hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#" className="transition-colors hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="transition-colors hover:text-white">
                  Updates
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-medium text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="transition-colors hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-medium text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="transition-colors hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 mx-auto mt-10 text-sm text-center border-t border-gray-800 max-w-7xl dark:border-dark-border">
          © 2025 Khalid. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
