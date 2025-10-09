import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
// import api from "../api";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    pin: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
     // const res = await api.registerVisitor(form);
      setMsg({ type: "success", text: "Registered. Check your email for confirmation." });
      setForm({ first_name: "", last_name: "", email: "", phone: "", pin: "" });
    } catch (err) {
      setMsg({ type: "danger", text: err?.response?.data?.message || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2>Register</h2>
      {msg && <Alert variant={msg.type}>{msg.text}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control name="first_name" value={form.first_name} onChange={handleChange} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="last_name" value={form.last_name} onChange={handleChange} required />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={form.phone} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>PIN (8 characters)</Form.Label>
              <Form.Control name="pin" value={form.pin} onChange={handleChange} minLength={8} maxLength={8} required />
            </Form.Group>
          </Col>
        </Row>

        {/* Captcha placeholder: backend will verify captcha token */}
        <Form.Group className="mb-3">
          <Form.Label>Captcha (placeholder)</Form.Label>
          <Form.Control placeholder="Captcha verification handled server-side" readOnly />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </Form>
    </Container>
  );
}
