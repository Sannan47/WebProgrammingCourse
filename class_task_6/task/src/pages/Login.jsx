import { useState } from "react";

export default function Login({ onLogin, onNavigateToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.message === "Login successful") {
        setEmail("");
        setPassword("");
        onLogin();
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className={validationErrors.email ? "input-error" : ""}
          />
          {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className={validationErrors.password ? "input-error" : ""}
          />
          {validationErrors.password && <span className="field-error">{validationErrors.password}</span>}
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="auth-button"
        >
          {loading ? "Logging in..." : "Sign In"}
        </button>

        <p className="form-footer">
          Don't have an account? <button onClick={onNavigateToSignup} className="link-text" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}>Create one now</button>
        </p>
      </div>
    </div>
  );
}