import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiArrowLeft, FiHome } from "react-icons/fi";

const NotFound = () => {
  const { user } = useAuth();

  // Determine where to send the user: if logged in, go to dashboard, else home
  const homeLink = user ? `/dashboard/${user.role}` : "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 dark:bg-dark-bg px-4">
      <div className="text-center max-w-md">
        {/* 404 graphic */}
        <div className="text-8xl font-extrabold text-primary dark:text-primary-400 mb-4">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={homeLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          {user ? "Back to Dashboard" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
