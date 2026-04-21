import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("login");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("http://localhost:5000/me", {
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setUserEmail(data.user.email);
        setPage("dashboard");
      }
    };

    checkUser();
  }, []);

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/me", {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      setUserEmail(data.user.email);
      setPage("dashboard");
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include"
    });

    setUserEmail("");
    setPage("login");
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#aa3bff" />
              <circle cx="16" cy="10" r="3" fill="white" />
              <path d="M16 15C18.2091 15 20 16.7909 20 19C20 21.2091 18.2091 23 16 23C13.7909 23 12 21.2091 12 19C12 16.7909 13.7909 15 16 15Z" fill="white" />
            </svg>
            <h1>AuthApp</h1>
          </div>

          {page !== "dashboard" && (
            <nav className="auth-nav">
              <button
                className={`nav-button ${page === "login" ? "active" : ""}`}
                onClick={() => setPage("login")}
              >
                Sign In
              </button>
              <button
                className={`nav-button ${page === "signup" ? "active" : ""}`}
                onClick={() => setPage("signup")}
              >
                Sign Up
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="app-main">
        {page === "login" && <Login onLogin={handleLogin} onNavigateToSignup={() => setPage("signup")} />}
        {page === "signup" && <Signup onNavigateToLogin={() => setPage("login")} />}
        {page === "dashboard" && (
          <Dashboard userEmail={userEmail} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}