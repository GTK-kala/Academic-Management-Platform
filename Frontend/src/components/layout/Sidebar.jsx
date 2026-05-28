import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiDollarSign,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = ({ open, setOpen }) => {
  const { user } = useAuth();

  const userRole = user?.role;

  const navigation = [
    {
      name: "Dashboard",
      to: `/dashboard/${userRole}`,
      icon: FiHome,
      roles: ["admin", "teacher", "student"],
    },
    {
      name: "Students",
      to: "/students",
      icon: FiUsers,
      roles: ["admin"],
    },
    {
      name: "Courses",
      to: "/courses",
      icon: FiBook,
      roles: ["admin", "teacher", "student"],
    },
    {
      name: "Fees",
      to: "/fees",
      icon: FiDollarSign,
      roles: ["admin", "student"],
    },
    {
      name: "Attendance",
      to: "/attendance",
      icon: FiCalendar,
      roles: ["admin", "teacher", "student"],
    },
    {
      name: "Grades",
      to: "/grades",
      icon: FiBarChart2,
      roles: ["admin", "teacher", "student"],
    },
    {
      name: "Settings",
      to: "/settings",
      icon: FiSettings,
      roles: ["admin", "teacher", "student"],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)]
          w-64 transform transition-transform duration-300
          bg-white dark:bg-dark-bg
          border-r border-gray-200 dark:border-dark-border
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="p-4 space-y-2">
          {navigation
            .filter((item) => item.roles.includes(userRole))
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-md transition-colors
                  ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-dark-card"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}

          {/* Logout */}
          <button className="flex items-center gap-3 px-4 py-3 mt-8 w-full text-left text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md">
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
