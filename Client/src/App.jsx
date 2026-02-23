import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";

// Pages
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";
import UserManagement from "./pages/admin/UserManagement";

// Placeholder pages for each role (we'll build them later)
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import AccountantDashboard from "./pages/accountant/Dashboard";

// Placeholder components for nested routes
const Placeholder = ({ title }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold text-secondary dark:text-primary">
      {title}
    </h2>
    <p className="mt-2 text-secondary dark:text-primary">
      This page is under construction.
    </p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Super Admin Routes */}
          <Route
            path="/superadmin"
            element={
              <PrivateRoute allowedRoles={["super_admin"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<SuperAdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="logs" element={<Placeholder title="System Logs" />} />
            <Route path="settings" element={<Placeholder title="Settings" />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route
              path="courses"
              element={<Placeholder title="Course Management" />}
            />
            <Route
              path="enrollments"
              element={<Placeholder title="Enrollments" />}
            />
            <Route
              path="timetable"
              element={<Placeholder title="Timetable" />}
            />
            <Route path="users" element={<UserManagement />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <PrivateRoute allowedRoles={["teacher"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route
              path="courses"
              element={<Placeholder title="My Courses" />}
            />
            <Route
              path="grades"
              element={<Placeholder title="Grade Entry" />}
            />
            <Route path="schedule" element={<Placeholder title="Schedule" />} />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <PrivateRoute allowedRoles={["student"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route
              path="courses"
              element={<Placeholder title="Available Courses" />}
            />
            <Route
              path="enrollments"
              element={<Placeholder title="My Enrollments" />}
            />
            <Route path="grades" element={<Placeholder title="Grades" />} />
            <Route path="fees" element={<Placeholder title="Fee Status" />} />
            <Route
              path="timetable"
              element={<Placeholder title="Timetable" />}
            />
          </Route>

          {/* Accountant Routes */}
          <Route
            path="/accountant"
            element={
              <PrivateRoute allowedRoles={["accountant"]}>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AccountantDashboard />} />
            <Route
              path="fees"
              element={<Placeholder title="Fee Management" />}
            />
            <Route path="invoices" element={<Placeholder title="Invoices" />} />
            <Route path="reports" element={<Placeholder title="Reports" />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
