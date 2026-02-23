import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      const role = result.user.role;
      if (role === "super_admin") navigate("/superadmin");
      else if (role === "admin") navigate("/admin");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "student") navigate("/student");
      else if (role === "accountant") navigate("/accountant");
      else navigate("/");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary dark:bg-secondary transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-secondary dark:text-primary hover:bg-primary dark:hover:bg-secondary"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-center text-secondary dark:text-primary">
            Academic Management
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary dark:text-primary"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-primary dark:border-secondary rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary dark:focus:ring-primary dark:focus:border-primary bg-white dark:bg-gray-700 text-secondary dark:text-primary"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary dark:text-primary"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-primary dark:border-secondary rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary dark:focus:ring-primary dark:focus:border-primary bg-white dark:bg-gray-700 text-secondary dark:text-primary"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary dark:bg-primary hover:bg-secondary-light dark:hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary dark:focus:ring-primary"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-secondary dark:text-primary">
          Demo: admin@example.com / password
        </p>
      </div>
    </div>
  );
};

export default Login;
