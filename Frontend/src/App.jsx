import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Register from "./pages/auth/Register";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import Home from "./pages/Home/Home";
// import AdminDashboard from "./pages/dashboard/AdminDashboard";
// import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
// import StudentDashboard from "./pages/dashboard/StudentDashboard";
// import StudentList from "./pages/students/StudentList";
// import AddStudent from "./pages/students/AddStudent";
// import CourseList from "./pages/courses/CourseList";
// import FeeManagement from "./pages/fees/FeeManagement";
// import Attendance from "./pages/academics/Attendance";
// import Grades from "./pages/academics/Grades";
// import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard layout */}
        <Route
          element={
            <ProtectedRoute roles={["admin", "teacher", "student"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/admin" />}
          /> */}
          {/* <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} /> */}

          {/* <Route
            path="/students"
            element={
              <ProtectedRoute roles={["admin"]}>
                <StudentList />
              </ProtectedRoute>
            }
          /> */}
          {/* <Route
            path="/students/add"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AddStudent />
              </ProtectedRoute>
            }
          /> */}
          {/* 
          <Route path="/courses" element={<CourseList />} />
          <Route path="/fees" element={<FeeManagement />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1000,
          removeDelay: 1000,
          style: {
            background: "rgba(30, 41, 59, 0.8)", // glassy dark-blue background
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "0.95rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.08)",
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: "#38bdf8",
              secondary: "#0f172a",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#0f172a",
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
