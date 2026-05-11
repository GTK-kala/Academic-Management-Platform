import { useState } from "react";
import toast from "react-hot-toast";
// import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    const BASE_URL = "http://localhost:3001";
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = { email, password };
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Login failed");
        setError(errorData.message || "Login failed");
      } else {
        const data = await res.json();
        console.log(data);
        login(data.email, data.role);
        navigate("/dashboard/admin");
      }
    } catch (err) {
      setError(err.message);
      console.log(error);
    } finally {
      setLoading(false);
      setPassword("");
      setEmail("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-primary-50 dark:bg-dark-bg">
      <div className="w-full max-w-lg p-8 bg-white shadow-xl dark:bg-dark-card rounded-2xl">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary rounded-xl">
            <span className="text-2xl font-bold text-white">AM</span>
          </div>
          <h2 className="text-3xl font-bold text-primary dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors bg-white border border-gray-300 rounded-lg dark:border-dark-border dark:bg-dark-bg dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-3 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="w-5 h-5 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
