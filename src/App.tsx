// src/App.tsx
import "./App.css";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { LoginForm } from "./features/auth/components/LoginForm";
import { AdminRoute, ProtectedRoute, PublicRoute } from "./routes/RouteGuard";

// Clean Page Separations Imported from src/pages/ ◄
import { UserDashboard } from "./pages/UserDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";

function App() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        fontFamily: "sans-serif",
      }}
    >
      {/* Navigation Links */}
      <nav style={styles.navbar}>
        <Link to="/login" style={styles.navLink}>
          Sign In
        </Link>
        <Link to="/register" style={styles.navLink}>
          Create Account
        </Link>
        <button 
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          style={styles.navButton}
        >
          Logout
        </button>
      </nav>

      {/* Viewport Routing Containers */}
      <div style={styles.container}>
        <Routes>
          {/* Public Guest Lanes */}
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/login"
              element={<LoginForm onSuccess={() => handleLoginSuccess()} />}
            />
          </Route>

          {/* Secure User Lanes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Secure Admin Lanes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Fallback Catch-all Route redirecting to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

// Clean UI Layout Styles
const styles = {
  navbar: {
    display: "flex",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eaeaea",
    justifyContent: "center",
    alignItems: "center"
  },
  navLink: { textDecoration: "none", color: "#0070f3", fontWeight: "bold" },
  navButton: {
    padding: "0.3rem 0.8rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem"
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  }
};

export default App;