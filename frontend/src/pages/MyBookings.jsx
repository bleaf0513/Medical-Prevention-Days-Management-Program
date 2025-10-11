import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Alert, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { FaCalendarAlt, FaClock, FaUser, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await api.getMyBookings();
      setBookings(response.data || []);
    } catch (err) {
      setMsg({ type: "danger", text: "Failed to load bookings. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (booking) => {
    if (booking.attended) {
      return <Badge bg="success">Attended</Badge>;
    } else if (booking.confirmed) {
      return <Badge bg="primary">Confirmed</Badge>;
    } else {
      return <Badge bg="warning">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5" style={{ background: 'var(--bg-secondary)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-5">
                  <h2 className="fw-bold text-primary mb-3">
                    <FaCalendarAlt className="me-3" />
                    My Bookings
                  </h2>
                  <p className="text-muted lead">
                    View and manage your medical appointments
                  </p>
                </div>

                {msg && (
                  <Alert variant={msg.type} className="mb-4">
                    {msg.text}
                  </Alert>
                )}

                {bookings.length === 0 ? (
                  <div className="text-center py-5">
                    <FaCalendarAlt size={64} className="text-muted mb-3" />
                    <h4 className="text-muted mb-3">No Bookings Yet</h4>
                    <p className="text-muted mb-4">
                      You haven't made any appointments yet. Book your first appointment to get started.
                    </p>
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => navigate("/booking")}
                    >
                      Book Appointment
                    </button>
                  </div>
                ) : (
                  <Row className="g-4">
                    {bookings.map((booking) => (
                      <Col md={6} lg={4} key={booking.id}>
                        <Card className="h-100 shadow-sm">
                          <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h6 className="fw-bold text-primary mb-0">
                                {booking.appointment_type?.name || 'Medical Service'}
                              </h6>
                              {getStatusBadge(booking)}
                            </div>
                            
                            <div className="mb-3">
                              <div className="d-flex align-items-center mb-2">
                                <FaCalendarAlt className="me-2 text-muted" />
                                <small className="text-muted">
                                  {new Date(booking.day?.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </small>
                              </div>
                              
                              <div className="d-flex align-items-center mb-2">
                                <FaClock className="me-2 text-muted" />
                                <small className="text-muted">
                                  {booking.slot?.time || 'Time TBD'}
                                </small>
                              </div>
                              
                              <div className="d-flex align-items-center">
                                <FaUser className="me-2 text-muted" />
                                <small className="text-muted">
                                  Booking Code: <strong>{booking.booking_code}</strong>
                                </small>
                              </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                {booking.attended ? (
                                  <FaCheckCircle className="text-success me-2" />
                                ) : booking.confirmed ? (
                                  <FaCheckCircle className="text-primary me-2" />
                                ) : (
                                  <FaTimesCircle className="text-warning me-2" />
                                )}
                                <small className="text-muted">
                                  {booking.attended ? 'Completed' : booking.confirmed ? 'Confirmed' : 'Pending'}
                                </small>
                              </div>
                              
                              <small className="text-muted">
                                {new Date(booking.created_at).toLocaleDateString()}
                              </small>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}

                <div className="text-center mt-5">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/booking")}
                  >
                    Book New Appointment
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
