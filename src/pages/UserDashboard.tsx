// src/pages/UserDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
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
      <p>You have successfully logged into your profile dashboard container layer.</p>
      <button
        onClick={handleLogout}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        Log Out
      </button>
    </div>
  );
};
