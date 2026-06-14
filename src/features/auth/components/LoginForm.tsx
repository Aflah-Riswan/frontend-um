import React, { useState } from "react";
import { authService } from "../services/auth.service";

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const data = await authService.login({
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));


      onSuccess();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error ||
        "Invalid email or password.";

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2>Account Login</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="button"
        >
          {loading ? "Verifying..." : "Sign In"}
        </button>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};