import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Public Pages
import Home from "../pages/Home/Home";

// Dashboard Pages
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import TeacherDashboard from "../pages/dashboard/TeacherDashboard";
import StudentDashboard from "../pages/dashboard/StudentDashboard";

// Student Pages
import StudentList from "../pages/students/StudentList";
import AddStudent from "../pages/students/AddStudent";
// import StudentProfile from "../pages/students/StudentProfile";

// Course Pages
import CourseList from "../pages/courses/CourseList";
import CourseDetail from "../pages/courses/CourseDetail";
// import AddCourse from "../pages/courses/AddCourse";

// Fee Pages
// import FeeManagement from "../pages/fees/FeeManagement";
// import PaymentHistory from "../pages/fees/PaymentHistory";

// Academic Pages
// import Attendance from "../pages/academics/Attendance";
// import Grades from "../pages/academics/Grades";

// Settings Pages
// import ProfileSettings from "../pages/settings/ProfileSettings";

// Error Pages
import NotFound from "../pages/NotFound";
// import Unauthorized from "../pages/Unauthorized";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}

      {/* Home Page - Public Landing */}
      <Route path="/" element={<Home />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ==================== PROTECTED ROUTES WITH LAYOUT ==================== */}

      <Route
        element={
          <ProtectedRoute roles={["admin", "teacher", "student"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* ===== DASHBOARD ROUTES ===== */}

        {/* Default dashboard redirect based on role */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher Dashboard */}
        <Route
          path="/dashboard/teacher"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== STUDENT MANAGEMENT ROUTES (Admin Only) ===== */}

        <Route
          path="/students"
          element={
            <ProtectedRoute roles={["admin"]}>
              <StudentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students/add"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddStudent />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/students/:id"
          element={
            <ProtectedRoute roles={["admin", "teacher"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/students/:id/edit"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddStudent />
            </ProtectedRoute>
          }
        />

        {/* ===== COURSE ROUTES ===== */}

        {/* View all courses - accessible by all authenticated users */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute roles={["admin", "teacher", "student"]}>
              <CourseList />
            </ProtectedRoute>
          }
        />

        {/* View course details - accessible by all authenticated users */}
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute roles={["admin", "teacher", "student"]}>
              <CourseDetail />
            </ProtectedRoute>
          }
        />

        {/* Add new course - Admin only */}
        {/* <Route
          path="/courses/add"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddCourse />
            </ProtectedRoute>
          }
        /> */}

        {/* Edit course - Admin only */}
        {/* <Route
          path="/courses/:id/edit"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddCourse />
            </ProtectedRoute>
          }
        /> */}

        {/* ===== FEE MANAGEMENT ROUTES ===== */}

        {/* Fee management - Admin and Student */}
        {/* <Route
          path="/fees"
          element={
            <ProtectedRoute roles={["admin", "student"]}>
              <FeeManagement />
            </ProtectedRoute>
          }
        /> */}

        {/* Payment history - Admin and Student */}
        {/* <Route
          path="/fees/history"
          element={
            <ProtectedRoute roles={["admin", "student"]}>
              <PaymentHistory />
            </ProtectedRoute>
          }
        /> */}

        {/* ===== ACADEMIC ROUTES ===== */}

        {/* Attendance - accessible by all authenticated users */}
        {/* <Route
          path="/attendance"
          element={
            <ProtectedRoute roles={["admin", "teacher", "student"]}>
              <Attendance />
            </ProtectedRoute>
          }
        /> */}

        {/* Grades - accessible by all authenticated users */}
        {/* <Route
          path="/grades"
          element={
            <ProtectedRoute roles={["admin", "teacher", "student"]}>
              <Grades />
            </ProtectedRoute>
          }
        /> */}

        {/* ===== SETTINGS ROUTES ===== */}

        {/* Profile Settings - accessible by all authenticated users */}
        {/* <Route
          path="/settings"
          element={
            <ProtectedRoute roles={["admin", "teacher", "student"]}>
              <ProfileSettings />
            </ProtectedRoute>
          }
        /> */}

        {/* Change Password */}
        {/* <Route
          path="/settings/password"
          element={
            <ProtectedRoute roles={["admin", "teacher", "student"]}>
              <ProfileSettings />
            </ProtectedRoute>
          }
        /> */}
      </Route>

      {/* ==================== ERROR ROUTES ==================== */}

      {/* Unauthorized Access Page */}
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

      {/* 404 Not Found - Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Dashboard Redirect Component - Redirects user based on their role
const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "admin":
      return <Navigate to="/dashboard/admin" replace />;
    case "teacher":
      return <Navigate to="/dashboard/teacher" replace />;
    case "student":
      return <Navigate to="/dashboard/student" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default AppRoutes;
