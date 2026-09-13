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
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiAward,
  FiChevronRight,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

const stats = [
  {
    icon: FiUsers,
    value: "10K+",
    label: "Active Students",
  },
  {
    icon: FiBookOpen,
    value: "200+",
    label: "Courses Managed",
  },
  {
    icon: FiDollarSign,
    value: "98%",
    label: "Fee Collection",
  },
  {
    icon: FiTrendingUp,
    value: "4.9/5",
    label: "User Experience",
  },
];

const features = [
  {
    icon: FiMousePointer,
    title: "Easy Enrollment",
    desc: "Students can browse available courses and enroll quickly without unnecessary paperwork.",
  },
  {
    icon: FiShield,
    title: "Role-Based Access",
    desc: "Dedicated experiences for administrators, teachers, and students with secure access control.",
  },
  {
    icon: FiCreditCard,
    title: "Smart Fee Tracking",
    desc: "Manage course fees, payments, outstanding balances, and payment status from one place.",
  },
  {
    icon: FiBarChart2,
    title: "Academic Insights",
    desc: "Monitor attendance, grades, enrollment, and student performance with useful insights.",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: FiUsers,
    title: "Create an Account",
    desc: "Get started with the role that matches your responsibilities.",
  },
  {
    step: "02",
    icon: FiBookOpen,
    title: "Set Up Academics",
    desc: "Create courses, assign teachers, and configure academic information.",
  },
  {
    step: "03",
    icon: FiCreditCard,
    title: "Enroll & Manage",
    desc: "Students enroll in courses while administrators manage fees and registrations.",
  },
  {
    step: "04",
    icon: FiTrendingUp,
    title: "Track Progress",
    desc: "Monitor attendance, grades, payments, and academic performance.",
  },
];

const testimonials = [
  {
    quote:
      "AcadManage gives administrators a much clearer view of students, courses, and academic operations.",
    name: "Sarah K.",
    role: "Academic Administrator",
  },
  {
    quote:
      "The fee management and enrollment workflow makes everyday administration much easier.",
    name: "James L.",
    role: "Finance Administrator",
  },
  {
    quote:
      "The interface is simple enough for teachers to use while still providing the information they need.",
    name: "Maria G.",
    role: "Head of Academics",
  },
];

const Home = () => {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-gray-800 dark:bg-dark-bg dark:text-gray-200">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50/40 px-4 pb-20 pt-12 dark:from-dark-bg dark:via-dark-bg dark:to-dark-card/40 md:pb-28 md:pt-24"
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            {/* Hero content */}
            <div className="text-center lg:text-left">
              <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                Smart academic management, simplified
              </div>

              <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-primary-800 dark:text-white sm:text-6xl lg:text-7xl">
                Manage Your Academy
                <span className="mt-2 block text-primary dark:text-primary-300">
                  Smarter.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl lg:mx-0">
                A modern platform for managing students, courses, teachers,
                attendance, grades, enrollments, and fees — all in one place.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
                >
                  Get Started
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white px-7 py-3.5 font-semibold text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary-50 dark:bg-dark-card dark:text-primary-300 dark:hover:bg-dark-border"
                >
                  Explore Platform
                  <FiChevronRight />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400 lg:justify-start">
                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Simple to use
                </span>

                <span className="flex items-center gap-2">
                  <FiShield className="text-primary" />
                  Role-based access
                </span>

                <span className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary" />
                  Built for academies
                </span>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -right-3 top-8 h-24 w-24 rounded-3xl bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative rounded-3xl border border-primary-100 bg-white p-3 shadow-2xl shadow-primary/10 dark:border-dark-border dark:bg-dark-card">
                {/* Browser top */}
                <div className="flex items-center justify-between rounded-2xl bg-primary-50 px-4 py-3 dark:bg-dark-bg">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />
                  </div>

                  <div className="rounded-lg bg-white px-5 py-1.5 text-xs text-gray-400 dark:bg-dark-card">
                    acadmanage.app
                  </div>

                  <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30" />
                </div>

                {/* Dashboard */}
                <div className="mt-3 grid grid-cols-[72px_1fr] gap-3">
                  {/* Sidebar */}
                  <div className="rounded-2xl bg-primary px-3 py-4">
                    <div className="mb-8 flex justify-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
                        <FiBookOpen />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="mx-auto h-8 w-8 rounded-lg bg-white/20" />
                      <div className="mx-auto h-8 w-8 rounded-lg bg-white/10" />
                      <div className="mx-auto h-8 w-8 rounded-lg bg-white/10" />
                      <div className="mx-auto h-8 w-8 rounded-lg bg-white/10" />
                    </div>
                  </div>

                  {/* Main dashboard */}
                  <div className="min-w-0 rounded-2xl bg-gray-50 p-4 dark:bg-dark-bg sm:p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-400">Dashboard</div>
                        <h3 className="mt-1 text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                          Academic Overview
                        </h3>
                      </div>

                      <div className="hidden rounded-lg bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary sm:block dark:bg-primary-900/30 dark:text-primary-300">
                        This Month
                      </div>
                    </div>

                    {/* Mini stats */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-dark-card">
                        <div className="flex items-center justify-between">
                          <FiUsers className="text-primary" />
                          <span className="text-[10px] text-primary">+12%</span>
                        </div>
                        <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                          1,248
                        </p>
                        <p className="text-[11px] text-gray-400">Students</p>
                      </div>

                      <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-dark-card">
                        <div className="flex items-center justify-between">
                          <FiBookOpen className="text-primary" />
                          <span className="text-[10px] text-primary">
                            Active
                          </span>
                        </div>
                        <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                          86
                        </p>
                        <p className="text-[11px] text-gray-400">Courses</p>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="mt-3 rounded-xl bg-white p-4 shadow-sm dark:bg-dark-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">
                            Student Performance
                          </p>
                          <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                            87.4%
                          </p>
                        </div>

                        <FiTrendingUp className="text-primary" />
                      </div>

                      <div className="mt-5 flex h-24 items-end gap-2">
                        {[38, 52, 45, 65, 58, 75, 68, 86, 78, 92].map(
                          (height, index) => (
                            <div
                              key={index}
                              className="flex-1 rounded-t-md bg-primary transition-all duration-500 hover:bg-primary-dark"
                              style={{ height: `${height}%` }}
                            />
                          ),
                        )}
                      </div>
                    </div>

                    {/* Bottom cards */}
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-dark-card">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-primary" />
                          <span className="text-xs text-gray-400">
                            Attendance
                          </span>
                        </div>
                        <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                          94%
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-dark-card">
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-primary" />
                          <span className="text-xs text-gray-400">
                            Collected
                          </span>
                        </div>
                        <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                          98%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-primary-100 bg-white p-4 shadow-xl dark:border-dark-border dark:bg-dark-card sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary dark:bg-primary-900/30 dark:text-primary-300">
                    <FiCheckCircle />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">System Status</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Everything is running
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="border-y border-gray-100 bg-white px-4 py-10 dark:border-dark-border dark:bg-dark-bg">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:bg-primary-50 hover:shadow-lg hover:shadow-primary/5 dark:border-dark-border dark:bg-dark-card dark:hover:border-primary-800 dark:hover:bg-primary-900/10"
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary transition-transform duration-300 group-hover:scale-110 dark:bg-primary-900/30 dark:text-primary-300">
                <stat.icon className="h-5 w-5" />
              </div>

              <div className="text-2xl font-bold text-primary dark:text-white sm:text-3xl">
                {stat.value}
              </div>

              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section
        id="features"
        className="bg-primary-50/70 px-4 py-20 dark:bg-dark-card/30 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary-900/30 dark:text-primary-300">
              Powerful Features
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-800 dark:text-white md:text-4xl">
              Everything Your Academy Needs
            </h2>

            <p className="mt-4 text-gray-500 dark:text-gray-400">
              One platform to bring academic, administrative, and financial
              workflows together.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-primary-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary-200 hover:shadow-xl hover:shadow-primary/10 dark:border-dark-border dark:bg-dark-bg dark:hover:border-primary-800"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-primary-100 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white dark:bg-primary-900/30 dark:text-primary-300 dark:group-hover:bg-primary">
                  <feature.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {feature.desc}
                </p>

                <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary dark:text-primary-300">
                  Learn more
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section
        id="how-it-works"
        className="bg-white px-4 py-20 dark:bg-dark-bg md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary-900/30 dark:text-primary-300">
              Simple Workflow
            </span>

            <h2 className="mt-4 text-3xl font-bold text-primary-800 dark:text-white md:text-4xl">
              How It Works
            </h2>

            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Get your academy organized in a few simple steps.
            </p>
          </div>

          <div className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
            {/* Connector */}
            <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-primary-200 dark:bg-dark-border md:block" />

            {howItWorks.map((item, idx) => (
              <div key={idx} className="relative z-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-primary text-white shadow-lg shadow-primary/20 dark:border-dark-bg">
                  <item.icon className="h-6 w-6" />
                </div>

                <div className="mt-5 text-xs font-bold tracking-widest text-primary dark:text-primary-300">
                  STEP {item.step}
                </div>

                <h3 className="mt-2 font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          PLATFORM HIGHLIGHT
      ========================================================= */}
      <section className="px-4 py-20 dark:bg-dark-bg md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 shadow-2xl shadow-primary/20 sm:px-10 md:px-16 md:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white">
                  One Unified Platform
                </span>

                <h2 className="mt-5 text-3xl font-bold leading-tight text-white md:text-4xl">
                  Spend less time managing data.
                  <span className="block text-primary-200">
                    Spend more time improving education.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-white/75">
                  Keep your academy's most important information connected. From
                  student enrollment to academic performance and fee management,
                  everything stays organized in one system.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    "Student management",
                    "Course management",
                    "Attendance tracking",
                    "Grade management",
                    "Fee management",
                    "Enrollment management",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-white/90"
                    >
                      <FiCheckCircle className="shrink-0 text-primary-200" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature visual */}
              <div className="relative">
                <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                  <div className="rounded-xl bg-white p-5 shadow-xl dark:bg-dark-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">
                          Monthly Overview
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                          Academy Performance
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary dark:bg-primary-900/30 dark:text-primary-300">
                        <FiAward />
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {[
                        ["Student Attendance", "94%"],
                        ["Course Completion", "87%"],
                        ["Fee Collection", "98%"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <div className="mb-2 flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">
                              {label}
                            </span>
                            <span className="font-semibold text-primary">
                              {value}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-primary-100 dark:bg-dark-border">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: value }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS
      ========================================================= */}
      <section
        id="testimonials"
        className="bg-primary-50/70 px-4 py-20 dark:bg-dark-card/30 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary-900/30 dark:text-primary-300">
              User Experience
            </span>

            <h2 className="mt-4 text-3xl font-bold text-primary-800 dark:text-white md:text-4xl">
              Built for the People Who Use It
            </h2>

            <div className="mt-4 flex items-center justify-center gap-1 text-primary">
              <FiStar />
              <FiStar />
              <FiStar />
              <FiStar />
              <FiStar />
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-primary-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 dark:border-dark-border dark:bg-dark-bg"
              >
                <div className="flex items-center gap-1 text-primary">
                  <FiStar />
                  <FiStar />
                  <FiStar />
                  <FiStar />
                  <FiStar />
                </div>

                <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-300">
                  "{testimonial.quote}"
                </p>

                <div className="mt-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-white">
                    {testimonial.name[0]}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="px-4 py-20 dark:bg-dark-bg md:py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center shadow-2xl shadow-primary/20 sm:px-10 md:py-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Ready to manage your academy smarter?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-white/75">
              Bring students, teachers, courses, attendance, grades, and fees
              together in one modern platform.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary-50"
              >
                Create Your Account
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/70 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="bg-gray-950 px-4 py-14 text-gray-400">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                  <FiBookOpen />
                </div>

                <h3 className="text-xl font-bold text-white">
                  Acad<span className="text-primary-300">Manage</span>
                </h3>
              </div>

              <p className="mt-4 max-w-xs text-sm leading-6">
                A modern academic management platform designed to simplify
                everyday academy operations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white">Platform</h4>

              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href="#features"
                    className="transition-colors hover:text-primary-300"
                  >
                    Features
                  </a>
                </li>

                <li>
                  <a
                    href="#how-it-works"
                    className="transition-colors hover:text-primary-300"
                  >
                    How It Works
                  </a>
                </li>

                <li>
                  <a
                    href="#testimonials"
                    className="transition-colors hover:text-primary-300"
                  >
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white">Account</h4>

              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    to="/register"
                    className="transition-colors hover:text-primary-300"
                  >
                    Create Account
                  </Link>
                </li>

                <li>
                  <Link
                    to="/login"
                    className="transition-colors hover:text-primary-300"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white">Why AcadManage?</h4>

              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-primary-300" />
                  Easy to use
                </li>

                <li className="flex items-center gap-2">
                  <FiShield className="text-primary-300" />
                  Secure access
                </li>

                <li className="flex items-center gap-2">
                  <FiTrendingUp className="text-primary-300" />
                  Data-driven insights
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-7 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 AcadManage. All rights reserved.</p>

            <div className="flex gap-5">
              <a href="#home" className="transition-colors hover:text-white">
                Back to top
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
