import React, { useContext } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

export default function AppNavbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="py-3 shadow-sm" bg="transparent">
      <Container>
        <Navbar.Brand as={Link} to="/" >
          <img src="/logo.png" alt="logo" width={100} height= {100} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/booking">Book</Nav.Link>
            <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            <Button variant="outline-primary" className="me-2" onClick={toggleTheme}>
              {theme === "light" ? "Dark" : "Light"} mode
            </Button>

            {admin ? (
              <>
                <Nav.Link as={NavLink} to="/admin/dashboard">Admin</Nav.Link>
                <Button variant="secondary" onClick={() => { logout(); navigate("/"); }}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => navigate("/admin/login")}>Admin Login</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
