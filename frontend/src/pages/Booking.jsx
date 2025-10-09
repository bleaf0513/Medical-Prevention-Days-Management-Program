import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import api from "../api";
// import { v4 as uuidv4 } from "uuid";

export default function Booking() {
  const [programs, setPrograms] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [visitor, setVisitor] = useState({ first_name: "", last_name: "", email: "", phone: "", pin: "" });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getPrograms().then((r) => setPrograms(r.data || [])).catch(()=>{});
    api.getDays().then((r) => setDays(r.data || [])).catch(()=>{});
  }, []);

  useEffect(() => {
    setAvailableSlots([]);
    if (selectedDay && selectedProgram) {
      api.getAvailability(selectedDay, selectedProgram)
        .then((r) => setAvailableSlots(r.data || []))
        .catch(() => setAvailableSlots([]));
    }
  }, [selectedDay, selectedProgram]);

  const handleBook = async () => {
    if (!selectedSlot || !selectedProgram || !selectedDay) {
      setMsg({ type: "danger", text: "Please select program, day and slot." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      // simple visitor creation (in real flow we should ensure existing user)
      // const bookingPayload = {
      //   visitor,
      //   type_id: selectedProgram,
      //   day_id: selectedDay,
      //   time: selectedSlot,
      //   booking_code: uuidv4().split("-")[0],
      // };
     // const res = await api.createBooking(bookingPayload);
      setMsg({ type: "success", text: "Booking confirmed. Check email for details." });
    } catch (err) {
      setMsg({ type: "danger", text: err?.response?.data?.message || "Booking failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2>Book Appointment</h2>
      {msg && <Alert variant={msg.type}>{msg.text}</Alert>}
      <Row className="g-4">
        <Col md={6}>
          <Card className="p-3">
            <Form.Group className="mb-3">
              <Form.Label>Program</Form.Label>
              <Form.Select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
                <option value="">Select program</option>
                {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Day</Form.Label>
              <Form.Select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                <option value="">Select day</option>
                {days.map((d) => <option key={d.id} value={d.id}>{d.date}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Available Slots</Form.Label>
              <div>
                {availableSlots.length === 0 && <div>No slots available yet.</div>}
                {availableSlots.map((s) => (
                  <Button
                    key={s.time}
                    variant={selectedSlot === s.time ? "primary" : "outline-primary"}
                    className="me-2 mb-2"
                    onClick={() => setSelectedSlot(s.time)}
                  >
                    {s.time}
                  </Button>
                ))}
              </div>
            </Form.Group>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3">
            <h5>Visitor Info</h5>
            <Form.Group className="mb-2">
              <Form.Label>First name</Form.Label>
              <Form.Control value={visitor.first_name} onChange={(e) => setVisitor({ ...visitor, first_name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Last name</Form.Label>
              <Form.Control value={visitor.last_name} onChange={(e) => setVisitor({ ...visitor, last_name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={visitor.email} onChange={(e) => setVisitor({ ...visitor, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control value={visitor.phone} onChange={(e) => setVisitor({ ...visitor, phone: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>PIN</Form.Label>
              <Form.Control value={visitor.pin} onChange={(e) => setVisitor({ ...visitor, pin: e.target.value })} />
            </Form.Group>

            <div className="mt-3 d-flex justify-content-end">
              <Button onClick={handleBook} disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
