import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.username || user?.email?.split("@")[0] || "User";
  const initial = displayName.slice(0, 1).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-link">
          <span className="brand-mark">D</span>
          <span className="brand-copy">
            <span className="brand-title">DevFeed</span>
            <span className="brand-subtitle">Developer updates</span>
          </span>
        </Link>

        <div className="navbar-actions">
          {user ? (
            <>
              <div className="user-chip">
                <span className="avatar avatar-sm">{initial}</span>
                <span className="user-copy">
                  <span className="user-name">{displayName}</span>
                  <span className="user-status">Online</span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-compact"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-secondary btn-compact"
              >
                Login
              </button>
              
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
