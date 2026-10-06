import { useState } from "react";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const userRole = user?.role;

  const HandleLogout = () => {
    logout();
    navigate("/login");
  };

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
          <button
            className="flex items-center w-full gap-3 px-4 py-3 mt-8 text-left text-gray-700 rounded-md dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              setShowDeleteModal(true);
            }}
          >
            <FiLogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </nav>
      </aside>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Log Out Confirmation
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to log out{" "}
                <strong>
                  {user?.firstName} {user?.lastName} ?
                </strong>
                <span className="inline ml-1">
                  This action cannot be undone and will remove all associated
                  records.
                </span>
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => HandleLogout()}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "logging out..." : "Log out"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
