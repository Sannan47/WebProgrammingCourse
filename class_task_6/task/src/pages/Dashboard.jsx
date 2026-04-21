export default function Dashboard({ userEmail, onLogout }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="welcome-section">
          <h2>Hello, {userEmail}</h2>
          <p>Welcome back to your dashboard!</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#aa3bff" />
              <circle cx="16" cy="10" r="3" fill="white" />
              <path d="M16 15C18.2091 15 20 16.7909 20 19C20 21.2091 18.2091 23 16 23C13.7909 23 12 21.2091 12 19C12 16.7909 13.7909 15 16 15Z" fill="white" />
            </svg>
            <span>AuthApp</span>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2026 AuthApp. All rights reserved.</p>
            <p>Sannan's Authentication System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}