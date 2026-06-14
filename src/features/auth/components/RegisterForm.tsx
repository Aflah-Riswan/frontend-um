import React, { useState } from 'react';
import { authService } from '../services/auth.service';


export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await authService.register({ name, email, password, role: 'user' });
      setMessage({ type: 'success', text: 'Account created successfully! Go to login.' });
      setName('');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Something went wrong during signup.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="card">
    <h2>Create an Account</h2>

    <form onSubmit={handleSubmit} className="form">

      <div className="input-group">
        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
      </div>

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
        {loading ? 'Registering...' : 'Sign Up'}
      </button>

      {message && (
        <div
          className={`alert ${
            message.type === 'success'
              ? 'alert-success'
              : 'alert-error'
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  </div>
);
};

