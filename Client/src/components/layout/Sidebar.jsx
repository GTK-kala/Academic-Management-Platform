import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const navigation = {
  super_admin: [
    { name: "Dashboard", href: "/superadmin", icon: HomeIcon },
    { name: "User Management", href: "/superadmin/users", icon: UsersIcon },
    {
      name: "System Logs",
      href: "/superadmin/logs",
      icon: ClipboardDocumentListIcon,
    },
    { name: "Settings", href: "/superadmin/settings", icon: CogIcon },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Courses", href: "/admin/courses", icon: BookOpenIcon },
    { name: "Enrollments", href: "/admin/enrollments", icon: AcademicCapIcon },
    { name: "Timetable", href: "/admin/timetable", icon: CalendarIcon },
    { name: "Users", href: "/admin/users", icon: UsersIcon },
  ],
  teacher: [
    { name: "Dashboard", href: "/teacher", icon: HomeIcon },
    { name: "My Courses", href: "/teacher/courses", icon: BookOpenIcon },
    {
      name: "Grade Entry",
      href: "/teacher/grades",
      icon: ClipboardDocumentListIcon,
    },
    { name: "Schedule", href: "/teacher/schedule", icon: CalendarIcon },
  ],
  student: [
    { name: "Dashboard", href: "/student", icon: HomeIcon },
    { name: "Available Courses", href: "/student/courses", icon: BookOpenIcon },
    {
      name: "My Enrollments",
      href: "/student/enrollments",
      icon: AcademicCapIcon,
    },
    {
      name: "Grades",
      href: "/student/grades",
      icon: ClipboardDocumentListIcon,
    },
    { name: "Fee Status", href: "/student/fees", icon: CurrencyDollarIcon },
    { name: "Timetable", href: "/student/timetable", icon: CalendarIcon },
  ],
  accountant: [
    { name: "Dashboard", href: "/accountant", icon: HomeIcon },
    {
      name: "Fee Management",
      href: "/accountant/fees",
      icon: CurrencyDollarIcon,
    },
    {
      name: "Invoices",
      href: "/accountant/invoices",
      icon: ClipboardDocumentListIcon,
    },
    { name: "Reports", href: "/accountant/reports", icon: CogIcon },
  ],
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const userRole = user?.role;
  const navItems = navigation[userRole] || [];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary dark:border-secondary">
          <h1 className="text-xl font-bold text-secondary dark:text-primary">
            Academic Manager
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-secondary dark:text-primary hover:bg-primary dark:hover:bg-secondary"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              location.pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-primary dark:bg-secondary text-secondary dark:text-primary"
                    : "text-secondary dark:text-primary hover:bg-primary dark:hover:bg-secondary"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive
                      ? "text-secondary dark:text-primary"
                      : "text-secondary dark:text-primary group-hover:text-secondary dark:group-hover:text-primary"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
