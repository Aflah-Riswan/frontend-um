// src/App.tsx
import "./App.css";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { LoginForm } from "./features/auth/components/LoginForm";
import { ProtectedRoute, PublicRoute } from "./routes/RouteGuard";

function App() {
  const navigate = useNavigate();

  const DashboardPlaceHolder = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
      localStorage.clear();
      navigate("/login");
    };

    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h1>🎉 Welcome, {user.name || "User"}!</h1>
        <p>
          You have successfully logged into your profile dashboard container
          layer.
        </p>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Log Out
        </button>
      </div>
    );
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
      </nav>

      {/* Viewport Routing Containers */}
      <div style={styles.container}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/login"
              element={<LoginForm onSuccess={() => navigate("/dashboard")} />}
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPlaceHolder />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

//
const styles = {
  navbar: {
    display: "flex",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#fff",
    borderBottom: "1px solid #eaeaea",
    justifyContent: "center",
  },
  navLink: { textDecoration: "none", color: "#0070f3" },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "1rem",
  },
};

export default App;
