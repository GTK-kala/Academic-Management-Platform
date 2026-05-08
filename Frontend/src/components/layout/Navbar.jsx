import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav
      className={`
      w-full h-16 flex items-center justify-between px-4 md:px-8
      bg-white dark:bg-dark-bg shadow-md
      transition-colors duration-300
    `}
    >
      <h1 className="text-xl font-bold text-primary dark:text-white">
        AcadManage
      </h1>
      <button
        onClick={toggleTheme}
        className="
          p-2 rounded-md
          bg-primary text-white
          hover:bg-primary-dark
          transition-colors
        "
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </nav>
  );
};

export default Navbar;
