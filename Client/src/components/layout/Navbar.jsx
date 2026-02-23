import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  Bars3Icon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
      <button
        type="button"
        className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center">
          {/* Optional search bar */}
        </div>

        <div className="ml-4 flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white focus:outline-none"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-1 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white">
            <BellIcon className="h-6 w-6" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white">
                {user?.name?.charAt(0) || "U"}
              </div>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 dark:divide-gray-700 focus:outline-none">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role?.replace("_", " ")}
                  </p>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={classNames(
                          active ? "bg-gray-100 dark:bg-gray-700" : "",
                          "block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300",
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
