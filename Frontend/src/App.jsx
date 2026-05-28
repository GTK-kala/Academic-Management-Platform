// src/App.jsx
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 1000,
              removeDelay: 1000,
              style: {
                background: "rgba(30, 41, 59, 0.8)",
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
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
