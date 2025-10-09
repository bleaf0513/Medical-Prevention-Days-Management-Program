import React, { useState, useContext } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await api.adminLogin(form);
      // assume response contains { admin: {...}, token: '...' }
      const { admin, token } = res.data;
      login(admin, token);
      navigate("/admin/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 520 }}>
      <h3>Admin Login</h3>
      {err && <Alert variant="danger">{err}</Alert>}
      <Form onSubmit={submit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </Form.Group>
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
}
