import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaCog, FaUser, FaLock } from "react-icons/fa";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const { loginAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    
    try {
      const res = await api.adminLogin(form);
      const { admin, token } = res.data;
      loginAdmin(admin, token);
      navigate("/admin/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--bg-secondary)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '80px', height: '80px' }}>
                    <FaCog size={32} className="text-primary" />
                  </div>
                  <h2 className="fw-bold text-primary mb-2">Admin Login</h2>
                  <p className="text-muted">Access the administration panel</p>
                </div>

                {err && (
                  <Alert variant="danger" className="mb-4">
                    {err}
                  </Alert>
                )}

                <Form onSubmit={submit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <FaUser className="me-2" />
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Enter email"
                      required
                      className="py-3"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Enter password"
                      required
                      className="py-3"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 py-3"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    <small>Need help? Contact system administrator</small>
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
