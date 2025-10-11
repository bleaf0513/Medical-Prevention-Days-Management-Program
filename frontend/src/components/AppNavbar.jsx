import React, { useContext, useState, useEffect } from "react";
import { Navbar, Container, Nav, Button, Dropdown } from "react-bootstrap";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { FaSun, FaMoon, FaUser, FaSignOutAlt, FaCog, FaBars, FaTimes } from "react-icons/fa";

export default function AppNavbar({ onBookAppointment }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBookAppointment = () => {
    if (onBookAppointment) {
      onBookAppointment();
    } else {
      // If no modal function provided, navigate to home page where modal is available
      navigate("/");
    }
    // Removed direct navigation to /booking page - only modal functionality remains
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar 
        expand="lg" 
        className={`modern-navbar ${scrolled ? 'scrolled' : ''}`} 
        bg="transparent" 
        sticky="top"
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand-modern">
            <div className="brand-logo">
              <img 
                src="/logo.png" 
                alt="Medical Prevention Logo" 
                width={100} 
                height={100}
                className="logo-img"
              />
              <div className="brand-text">
                <div className="brand-title">Medical Prevention</div>
                <div className="brand-subtitle">Health & Wellness</div>
              </div>
            </div>
          </Navbar.Brand>
          
          <Navbar.Toggle 
            aria-controls="main-nav" 
            className="navbar-toggle-modern"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </Navbar.Toggle>
          
          <Navbar.Collapse id="main-nav" className={`navbar-collapse-modern ${mobileMenuOpen ? 'show' : ''}`}>
            <Nav className="me-auto navbar-nav-modern">
              <Nav.Link as={NavLink} to="/" className="nav-link-modern">
                <span>Home</span>
              </Nav.Link>
              <Nav.Link 
                onClick={handleBookAppointment} 
                className="nav-link-modern"
                style={{ cursor: 'pointer' }}
              >
                <span>Book Appointment</span>
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register" className="nav-link-modern">
                <span>Register</span>
              </Nav.Link>
            </Nav>

            <Nav className="ms-auto align-items-center gap-3 navbar-actions">
              {/* Theme Toggle */}
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={toggleTheme}
                className="theme-toggle-btn"
              >
                {theme === "light" ? <FaMoon /> : <FaSun />}
                <span className="d-none d-md-inline">
                  {theme === "light" ? "Dark" : "Light"}
                </span>
              </Button>

              {/* User Menu */}
              {user ? (
                <Dropdown className="user-dropdown">
                  <Dropdown.Toggle className="user-toggle-btn">
                    <div className="user-avatar">
                      <FaUser />
                    </div>
                    <span className="d-none d-md-inline user-name">{user.first_name}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="user-dropdown-menu">
                    <Dropdown.Item onClick={() => navigate("/my-bookings")} className="dropdown-item-modern">
                      <FaUser className="me-2" />
                      My Bookings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { logout(); navigate("/"); }} className="dropdown-item-modern">
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : admin ? (
                <Dropdown className="user-dropdown">
                  <Dropdown.Toggle className="admin-toggle-btn">
                    <div className="user-avatar admin-avatar">
                      <FaCog />
                    </div>
                    <span className="d-none d-md-inline user-name">Admin</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="user-dropdown-menu">
                    <Dropdown.Item onClick={() => navigate("/admin/dashboard")} className="dropdown-item-modern">
                      <FaCog className="me-2" />
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { logout(); navigate("/"); }} className="dropdown-item-modern">
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="auth-buttons">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="auth-btn"
                  >
                    Login
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate("/admin/login")}
                    className="auth-btn primary"
                  >
                    Admin Login
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style jsx>{`
        .modern-navbar {
          padding: 1rem 0;
          transition: all 0.3s ease;
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .modern-navbar.scrolled {
          padding: 0.5rem 0;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        [data-theme="dark"] .modern-navbar {
          background: rgba(10, 10, 10, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        [data-theme="dark"] .modern-navbar.scrolled {
          background: rgba(10, 10, 10, 0.95);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .navbar-brand-modern {
          text-decoration: none;
        }
        
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .logo-img {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
        }
        
        .logo-img:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }
        
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        
        .brand-title {
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-primary);
          line-height: 1.2;
        }
        
        .brand-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        
        .navbar-toggle-modern {
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 1.25rem;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .navbar-toggle-modern:hover {
          background: var(--bg-secondary);
          color: var(--primary);
        }
        
        .navbar-collapse-modern {
          transition: all 0.3s ease;
        }
        
        .navbar-nav-modern {
          gap: 0.5rem;
        }
        
        .nav-link-modern {
          position: relative;
          color: var(--text-secondary) !important;
          font-weight: 500;
          padding: 0.75rem 1rem !important;
          border-radius: 12px;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .nav-link-modern:hover,
        .nav-link-modern.active {
          color: var(--primary) !important;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .nav-link-modern::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link-modern:hover::after,
        .nav-link-modern.active::after {
          width: 80%;
        }
        
        .navbar-actions {
          gap: 0.75rem;
        }
        
        .theme-toggle-btn {
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-primary);
          padding: 0.5rem 0.75rem;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .theme-toggle-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: translateY(-1px);
        }
        
        .user-dropdown {
          position: relative;
        }
        
        .user-toggle-btn,
        .admin-toggle-btn {
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.5rem 0.75rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .user-toggle-btn:hover,
        .admin-toggle-btn:hover {
          background: var(--bg-secondary);
          border-color: var(--primary);
          color: var(--primary);
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.875rem;
        }
        
        .admin-avatar {
          background: var(--gradient-secondary);
        }
        
        .user-name {
          font-weight: 500;
        }
        
        .user-dropdown-menu {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          margin-top: 0.5rem;
        }
        
        [data-theme="dark"] .user-dropdown-menu {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }
        
        .dropdown-item-modern {
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: var(--text-primary);
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .dropdown-item-modern:hover {
          background: var(--bg-secondary);
          color: var(--primary);
        }
        
        .auth-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .auth-btn {
          border-radius: 12px;
          padding: 0.5rem 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .auth-btn.primary {
          background: var(--gradient-primary);
          border: none;
        }
        
        .auth-btn:hover {
          transform: translateY(-1px);
        }
        
        /* Mobile styles */
        @media (max-width: 991px) {
          .navbar-collapse-modern {
            background: var(--surface);
            border-radius: 12px;
            margin-top: 1rem;
            padding: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid var(--border);
          }
          
          [data-theme="dark"] .navbar-collapse-modern {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          }
          
          .navbar-nav-modern {
            margin-bottom: 1rem;
          }
          
          .nav-link-modern {
            margin-bottom: 0.5rem;
          }
          
          .navbar-actions {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .auth-buttons {
            width: 100%;
            flex-direction: column;
          }
          
          .auth-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
