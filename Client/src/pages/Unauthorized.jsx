import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary dark:bg-secondary">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-secondary dark:text-primary">
          403
        </h1>
        <p className="text-xl text-secondary dark:text-primary mt-4">
          Unauthorized Access
        </p>
        <p className="text-secondary dark:text-primary mt-2">
          You don't have permission to view this page.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-4 py-2 bg-secondary dark:bg-primary text-white dark:text-secondary rounded hover:bg-secondary-light dark:hover:bg-primary-dark"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
