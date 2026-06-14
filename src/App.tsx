// src/App.tsx
import "./App.css";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { LoginForm } from "./features/auth/components/LoginForm";
import { AdminRoute, ProtectedRoute, PublicRoute } from "./routes/RouteGuard";

const AdminDashboard = () => {
  const admin = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <>
      <div
        style={{
          textAlign: "center",
          border: "2px solid #ef4444",
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <h1>👑 Admin Control Center</h1>
        <p>Secure system clearance verified for Admin: {admin.name}</p>
      </div>
    </>
  );
};

const DashboardPlaceHolder = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}")
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
        <button onClick={()=>{
          localStorage.clear()
          navigate('/login')
        }}>Logout</button>
      </nav>

      {/* Viewport Routing Containers */}
      <div style={styles.container}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/login"
              element={<LoginForm onSuccess={() => handleLoginSuccess()} />}
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPlaceHolder />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
