import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaCalendarAlt, FaEnvelope, FaHome } from "react-icons/fa";

export default function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.booking || null;
  
  // Debug: Log booking data structure
  console.log('Confirmation page - booking data:', bookingData);

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--bg-secondary)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0 text-center">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '100px', height: '100px' }}>
                    <FaCheckCircle size={48} className="text-success" />
                  </div>
                  <h2 className="fw-bold text-success mb-3">Booking Confirmed!</h2>
                  <p className="text-muted lead">
                    Your appointment has been successfully booked
                  </p>
                </div>

                {bookingData && (
                  <div className="bg-light rounded p-4 mb-4">
                    <h5 className="fw-bold mb-3">Appointment Details</h5>
                    <div className="row g-3 text-start">
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="me-2 text-primary" />
                          <div>
                            <small className="text-muted">Service</small>
                            <div className="fw-medium">{bookingData.appointmentType?.name || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="me-2 text-primary" />
                          <div>
                            <small className="text-muted">Date</small>
                            <div className="fw-medium">
                              {(() => {
                                try {
                                  if (!bookingData.day?.date) return 'N/A';
                                  
                                  // Handle ISO date format from Laravel
                                  let dateStr = bookingData.day.date;
                                  
                                  // Extract date part from ISO string
                                  if (typeof bookingData.day.date === 'string') {
                                    if (bookingData.day.date.includes('T')) {
                                      // ISO format: "2025-10-21T00:00:00.000000Z" -> "2025-10-21"
                                      dateStr = bookingData.day.date.split('T')[0];
                                    } else if (bookingData.day.date.includes(' ')) {
                                      // DateTime format: "2025-10-21 00:00:00" -> "2025-10-21"
                                      dateStr = bookingData.day.date.split(' ')[0];
                                    }
                                  }
                                  
                                  const [year, month, dayNum] = dateStr.split('-');
                                  const date = new Date(year, month - 1, dayNum); // month is 0-indexed
                                  
                                  return date.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  });
                                } catch (error) {
                                  console.error('Date parsing error in confirmation:', error, 'Original date:', bookingData.day?.date);
                                  return 'Invalid Date';
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="me-2 text-primary" />
                          <div>
                            <small className="text-muted">Time</small>
                            <div className="fw-medium">
                              {bookingData.slot ? `${bookingData.slot.start_time} - ${bookingData.slot.end_time}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <FaEnvelope className="me-2 text-primary" />
                          <div>
                            <small className="text-muted">Booking Code</small>
                            <div className="fw-medium">{bookingData.booking_code}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4 p-3 bg-primary bg-opacity-10 rounded">
                  <FaEnvelope className="text-primary me-2" />
                  <span className="text-muted">
                    A confirmation email has been sent with your booking details
                  </span>
                </div>

                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button 
                    variant="primary" 
                    onClick={() => navigate("/my-bookings")}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaCalendarAlt />
                    View My Bookings
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate("/")}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaHome />
                    Back to Home
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
