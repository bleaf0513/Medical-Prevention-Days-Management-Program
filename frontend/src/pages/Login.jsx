import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    pin: "",
  });
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    
    try {
      const response = await api.login(form);
      loginUser(response.data.user, response.data.token);
      setMsg({ type: "success", text: "Login successful! Redirecting..." });
      setTimeout(() => navigate("/booking"), 1000);
    } catch (err) {
      setMsg({ 
        type: "danger", 
        text: err?.response?.data?.message || "Login failed. Please check your credentials." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--bg-secondary)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <img 
                    src="/logo.png" 
                    alt="Medical Prevention" 
                    width={80} 
                    height={80}
                    className="mb-3"
                    style={{ borderRadius: '12px' }}
                  />
                  <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {msg && (
                  <Alert variant={msg.type} className="mb-4">
                    {msg.text}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <FaUser className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="py-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">
                      <FaLock className="me-2" />
                      PIN (8 digits)
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPin ? "text" : "password"}
                        name="pin"
                        value={form.pin}
                        onChange={handleChange}
                        placeholder="Enter your 8-digit PIN"
                        maxLength={8}
                        required
                        className="py-3 pe-5"
                      />
                      <Button
                        variant="link"
                        className="position-absolute end-0 top-50 translate-middle-y p-0 me-3"
                        onClick={() => setShowPin(!showPin)}
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {showPin ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary fw-medium text-decoration-none">
                      Register here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
