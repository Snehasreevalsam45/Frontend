import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar({ token, onLogoutTrigger }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">
        <h2>GreenStock</h2>
      </div>

      <ul className="nav-links">
        {/* Home Link */}
        {location.pathname !== "/" && (
          <li>
            <Link to="/">Home</Link>
          </li>
        )}

        {!token ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>

            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>

            <li>
              <button
                className="logout-btn-nav"
                onClick={onLogoutTrigger}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;