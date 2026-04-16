export default function Dashboard({ userEmail, onLogout }) {
  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Hello {userEmail} 👋</h2>

      <button onClick={onLogout}>Logout</button>
    </div>
  );
}