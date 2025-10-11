import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    pin: "",
    g_recaptcha_response: "",
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
      // Get captcha response if available
      const captchaResponse = window.grecaptcha?.getResponse();
      const formData = {
        ...form,
        g_recaptcha_response: captchaResponse || ""
      };
      
      const response = await api.register(formData);
      loginUser(response.data.user, response.data.token);
      setMsg({ type: "success", text: "Registration successful! Welcome!" });
      setTimeout(() => navigate("/booking"), 1500);
    } catch (err) {
      setMsg({ 
        type: "danger", 
        text: err?.response?.data?.message || "Registration failed. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--bg-secondary)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
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
                  <h2 className="fw-bold text-primary mb-2">Create Account</h2>
                  <p className="text-muted">Join us for better health management</p>
                </div>

                {msg && (
                  <Alert variant={msg.type} className="mb-4">
                    {msg.text}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          <FaUser className="me-2" />
                          First Name
                        </Form.Label>
                        <Form.Control
                          name="first_name"
                          value={form.first_name}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          required
                          className="py-3"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          <FaUser className="me-2" />
                          Last Name
                        </Form.Label>
                        <Form.Control
                          name="last_name"
                          value={form.last_name}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          required
                          className="py-3"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <FaEnvelope className="me-2" />
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

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <FaPhone className="me-2" />
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number (optional)"
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
                        placeholder="Create an 8-digit PIN"
                        minLength={8}
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
                    <Form.Text className="text-muted">
                      Choose a secure 8-digit PIN for account access
                    </Form.Text>
                  </Form.Group>

                  {/* reCAPTCHA Widget */}
                  <div className="mb-4 d-flex justify-content-center">
                    <div 
                      className="g-recaptcha" 
                      data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      data-theme="light"
                    ></div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary fw-medium text-decoration-none">
                      Sign in here
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
