import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Row, Col } from "react-bootstrap";
import api from "../api";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.getBookings(params);
      setBookings(res.data || []);
    } catch (e) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load({ q });
  };

  return (
    <Container className="py-5">
      <h3>Admin Dashboard</h3>

      <Form onSubmit={handleSearch} className="mb-3">
        <Row>
          <Col md={4}>
            <Form.Control placeholder="Search by booking code or last name" value={q} onChange={(e)=>setQ(e.target.value)} />
          </Col>
          <Col>
            <Button type="submit">Search</Button>
          </Col>
        </Row>
      </Form>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Booking Code</th>
            <th>Visitor</th>
            <th>Program</th>
            <th>Day</th>
            <th>Time</th>
            <th>Confirmed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (<tr><td colSpan="7">Loading...</td></tr>) :
            bookings.length === 0 ? (<tr><td colSpan="7">No bookings found.</td></tr>) :
            bookings.map(b => (
              <tr key={b.id}>
                <td>{b.booking_code}</td>
                <td>{b.visitor_first_name} {b.visitor_last_name}</td>
                <td>{b.type_name}</td>
                <td>{b.day_date}</td>
                <td>{b.time}</td>
                <td>{b.confirmed ? "Yes" : "No"}</td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-2">Edit</Button>
                  <Button size="sm" variant="outline-danger">Cancel</Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </Container>
  );
}
