import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">React Router App</Link>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link
              to="/"
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/about"
              className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
            >
              About
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/contact"
              className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
