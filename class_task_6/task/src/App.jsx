import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("login");
  const [userEmail, setUserEmail] = useState("");

  const handleLogin = (email) => {
    setUserEmail(email);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUserEmail("");
    setPage("login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Auth App</h1>

      {page !== "dashboard" && (
        <>
          <button onClick={() => setPage("login")}>Login</button>
          <button onClick={() => setPage("signup")}>Signup</button>
        </>
      )}

      {page === "login" && <Login onLogin={handleLogin} />}
      {page === "signup" && <Signup />}
      {page === "dashboard" && (
        <Dashboard userEmail={userEmail} onLogout={handleLogout} />
      )}
    </div>
  );
}