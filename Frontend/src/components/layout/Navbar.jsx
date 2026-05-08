import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon, FiBell } from "react-icons/fi";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav
      className="
      fixed top-0 left-0 right-0 z-40 h-16
      flex items-center justify-between px-4 md:px-8
      bg-white dark:bg-dark-bg shadow-md
      transition-colors duration-300
    "
    >
      {/* Mobile hamburger */}
      <button
        className="md:hidden text-primary dark:text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <h1 className="text-xl font-bold text-primary dark:text-white hidden md:block">
        AcadManage
      </h1>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-600 dark:text-gray-300">
          <FiBell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          {darkMode ? (
            <FiSun className="w-5 h-5" />
          ) : (
            <FiMoon className="w-5 h-5" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
