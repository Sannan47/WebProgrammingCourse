import { useState } from "react";

export default function Signup({ onNavigateToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.message === "Signup successful") {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => {
          setEmail("");
          setPassword("");
          onNavigateToLogin();
        }, 1500);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("Error signing up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSignup();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join us for a secure experience</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

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
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className={validationErrors.password ? "input-error" : ""}
          />
          {validationErrors.password && <span className="field-error">{validationErrors.password}</span>}
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="auth-button"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="form-footer">          Already have an account? <button onClick={onNavigateToLogin} className="link-text" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}>Sign in instead</button>
        </p>
      </div>
    </div>
  );
}