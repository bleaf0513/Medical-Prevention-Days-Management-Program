import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { FaCalendarAlt, FaClock, FaUser, FaCheckCircle, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const categoryInfo = {
  "centro-antifumo": {
    name: "Centro Antifumo",
    description: "Professional smoking cessation programs with personalized support and proven methods.",
    icon: "🚭"
  },
  "nutrizionista": {
    name: "Nutrizionista", 
    description: "Expert nutritional counseling and personalized diet plans for optimal health.",
    icon: "🥗"
  },
  "screening-epatite-c": {
    name: "Screening Epatite C",
    description: "Comprehensive Hepatitis C screening and early detection services.",
    icon: "🩺"
  },
  "prevenzione-andrologica": {
    name: "Prevenzione Andrologica",
    description: "Specialized men's health prevention and screening services.",
    icon: "👨‍⚕️"
  }
};

export default function CategoryBooking() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [appointments, setAppointments] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [msg, setMsg] = useState(null);
  const [userBookings, setUserBookings] = useState([]);

  const currentCategory = categoryInfo[category];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!currentCategory) {
      navigate("/");
      return;
    }
    loadData();
  }, [user, navigate, category, currentCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, typesRes, bookingsRes] = await Promise.all([
        api.getAppointments(),
        api.getAppointmentTypes(),
        api.getMyBookings()
      ]);
      
      setAppointments(appointmentsRes.data || []);
      setAppointmentTypes(typesRes.data || []);
      setUserBookings(bookingsRes.data || []);
    } catch (err) {
      console.error('Load data error:', err);
      setMsg({ type: "danger", text: "Failed to load data. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Filter appointment types by category
  const getCategoryAppointmentTypes = () => {
    if (!appointmentTypes.length) return [];
    
    return appointmentTypes.filter(type => {
      // Check if any specialist in this appointment type belongs to the current category
      return type.specialists?.some(specialist => {
        const specialistCategory = specialist.specialty?.name?.toLowerCase().replace(/\s+/g, '-');
        return specialistCategory === category;
      });
    });
  };

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
    setSelectedDay("");
    setSelectedSlot("");
    setSelectedTime("");
  };

  const handleDayChange = (dayId) => {
    setSelectedDay(dayId);
    setSelectedSlot("");
    setSelectedTime("");
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    // Find the slot that matches this time
    const slots = getAvailableSlots();
    
    // Normalize time formats for comparison
    const normalizeTime = (time) => {
      if (!time) return '';
      // Convert "HH:MM:SS" to "HH:MM" or keep "HH:MM" as is
      return time.substring(0, 5);
    };
    
    const normalizedTime = normalizeTime(time);
    const matchingSlot = slots.find(slot => 
      normalizeTime(slot.start_time) === normalizedTime
    );
    
    if (matchingSlot) {
      setSelectedSlot(matchingSlot.id.toString());
    } else {
      setSelectedSlot("");
    }
  };

  const getAvailableDays = () => {
    if (!selectedType) return [];
    
    // Get all days with available slots for the selected type
    const availableDays = appointments.filter(day => 
      day.slots.some(slot => 
        slot.type_id === parseInt(selectedType) && 
        slot.booked < slot.capacity
      )
    );
    
    
    // Sort by date and take only the next 2 days
    return availableDays
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 2);
  };

  const getAvailableSlots = () => {
    if (!selectedType || !selectedDay) return [];
    
    const day = appointments.find(d => d.id === parseInt(selectedDay));
    if (!day) return [];
    
    return day.slots.filter(slot => 
      slot.type_id === parseInt(selectedType) && 
      slot.booked < slot.capacity
    );
  };

  // Check if user already has a booking for this appointment type on this day
  const hasExistingBooking = () => {
    if (!selectedType || !selectedDay) return false;
    
    // Simplified check - just return false for now to allow booking
    return false;
  };

  const handleBooking = async () => {
    if (!selectedType || !selectedDay || !selectedTime) {
      setMsg({ type: "danger", text: "Please select appointment type, day, and time." });
      return;
    }

    // Find the slot that matches the selected time
    const availableSlots = getAvailableSlots();
    
    // Normalize time formats for comparison
    const normalizeTime = (time) => {
      if (!time) return '';
      // Convert "HH:MM:SS" to "HH:MM" or keep "HH:MM" as is
      return time.substring(0, 5);
    };
    
    const normalizedSelectedTime = normalizeTime(selectedTime);
    const matchingSlot = availableSlots.find(slot => 
      normalizeTime(slot.start_time) === normalizedSelectedTime
    );
    
    if (!matchingSlot) {
      setMsg({ type: "danger", text: "Selected time is no longer available. Please choose another time." });
      return;
    }

    if (hasExistingBooking()) {
      setMsg({ type: "danger", text: "You already have a booking for this appointment type on this day." });
      return;
    }

    setLoading(true);
    setMsg(null);
    
    try {
      const bookingData = {
        type_id: parseInt(selectedType),
        day_id: parseInt(selectedDay),
        slot_id: matchingSlot.id
      };
      
      const response = await api.bookAppointment(bookingData);
      
      console.log('Booking successful:', response.data);
      
      // Refresh data to show updated slot availability
      await loadData();
      
      // Navigate to confirmation page with booking data
      navigate("/confirmation", { 
        state: { booking: response.data.booking } 
      });
    } catch (err) {
      setMsg({ 
        type: "danger", 
        text: err?.response?.data?.message || "Booking failed. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryTypes = getCategoryAppointmentTypes();

  if (loading && appointments.length === 0) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading appointments...</p>
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
                {/* Header */}
                <div className="text-center mb-5">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate("/")}
                    className="mb-3"
                  >
                    <FaArrowLeft className="me-2" />
                    Back to Services
                  </Button>
                  
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <span className="display-4 me-3">{currentCategory.icon}</span>
                    <div>
                      <h2 className="fw-bold text-primary mb-2">
                        {currentCategory.name}
                      </h2>
                      <p className="text-muted mb-0">
                        {currentCategory.description}
                      </p>
                    </div>
                  </div>
                </div>

                {msg && (
                  <Alert variant={msg.type} className="mb-4">
                    {msg.text}
                  </Alert>
                )}

                {hasExistingBooking() && (
                  <Alert variant="warning" className="mb-4">
                    <FaExclamationTriangle className="me-2" />
                    You already have a booking for this appointment type on this day. 
                    You cannot book multiple slots for the same type on the same day.
                  </Alert>
                )}

                <Row className="g-4">
                  {/* Selection Steps */}
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Body className="p-4">
                        <h5 className="fw-bold mb-4">
                          <FaUser className="me-2 text-primary" />
                          Select Your Appointment
                        </h5>
                        
                        {/* Step 1: Appointment Type */}
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-medium">1. Choose Service Type</Form.Label>
                          <Form.Select
                            value={selectedType}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="py-3"
                          >
                            <option value="">Select a service type...</option>
                            {categoryTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </Form.Select>
                          {categoryTypes.length === 0 && (
                            <Form.Text className="text-muted">
                              No appointment types available for this category.
                            </Form.Text>
                          )}
                        </Form.Group>

                        {/* Step 2: Day Selection */}
                        {selectedType && (
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-medium">2. Select Date</Form.Label>
                            <Form.Select
                              value={selectedDay}
                              onChange={(e) => handleDayChange(e.target.value)}
                              className="py-3"
                            >
                              <option value="">Choose a date...</option>
                              {getAvailableDays().map((day) => (
                                <option key={day.id} value={day.id}>
                                  {(() => {
                                    try {
                                      // Handle ISO date format from Laravel (e.g., "2025-10-21T00:00:00.000000Z")
                                      let dateStr = day.date;
                                      
                                      // Extract date part from ISO string
                                      if (typeof day.date === 'string') {
                                        if (day.date.includes('T')) {
                                          // ISO format: "2025-10-21T00:00:00.000000Z" -> "2025-10-21"
                                          dateStr = day.date.split('T')[0];
                                        } else if (day.date.includes(' ')) {
                                          // DateTime format: "2025-10-21 00:00:00" -> "2025-10-21"
                                          dateStr = day.date.split(' ')[0];
                                        }
                                        // Already in YYYY-MM-DD format, use as is
                                      }
                                      
                                      
                                      const [year, month, dayNum] = dateStr.split('-');
                                      
                                      // Validate date components
                                      if (!year || !month || !dayNum) {
                                        console.error('Invalid date components:', { year, month, dayNum, dateStr, originalDate: day.date });
                                        return 'Invalid Date';
                                      }
                                      
                                      const date = new Date(year, month - 1, dayNum); // month is 0-indexed
                                      
                                      // Check if date is valid
                                      if (isNaN(date.getTime())) {
                                        console.error('Invalid date created:', { year, month, dayNum, date });
                                        return 'Invalid Date';
                                      }
                                      
                                      return date.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      });
                                    } catch (error) {
                                      console.error('Date parsing error:', error, 'Original date:', day.date);
                                      return 'Invalid Date';
                                    }
                                  })()}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Text className="text-muted">
                              Showing next 2 available days for this service
                            </Form.Text>
                          </Form.Group>
                        )}

                        {/* Step 3: Time Selection */}
                        {selectedDay && (
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-medium">3. Choose Time</Form.Label>
                            <Form.Control
                              type="time"
                              value={selectedTime}
                              onChange={(e) => handleTimeChange(e.target.value)}
                              className="py-3"
                              disabled={hasExistingBooking()}
                            />
                            <Form.Text className="text-muted">
                              Available times: {getAvailableSlots().map(slot => slot.start_time).join(', ')}
                            </Form.Text>
                          </Form.Group>
                        )}

                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Booking Summary */}
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Body className="p-4">
                        <h5 className="fw-bold mb-4">
                          <FaCheckCircle className="me-2 text-success" />
                          Booking Summary
                        </h5>

                        {user && (
                          <div className="mb-4 p-3 bg-light rounded">
                            <h6 className="fw-bold mb-2">Patient Information</h6>
                            <p className="mb-1">
                              <strong>Name:</strong> {user.first_name} {user.last_name}
                            </p>
                            <p className="mb-0">
                              <strong>Email:</strong> {user.email}
                            </p>
                          </div>
                        )}

                        {selectedType && selectedDay && selectedTime && (
                          <div className="mb-4 p-3 bg-primary bg-opacity-10 rounded">
                            <h6 className="fw-bold mb-2 text-primary">Appointment Details</h6>
                            <p className="mb-1">
                              <strong>Service:</strong> {
                                categoryTypes.find(t => t.id === parseInt(selectedType))?.name
                              }
                            </p>
                            <p className="mb-1">
                              <strong>Date:</strong> {
                                (() => {
                                  const dayData = appointments.find(d => d.id === parseInt(selectedDay));
                                  if (!dayData?.date) return 'No date selected';
                                  
                                  try {
                                    // Handle ISO date format from Laravel
                                    let dateStr = dayData.date;
                                    
                                    // Extract date part from ISO string
                                    if (typeof dayData.date === 'string') {
                                      if (dayData.date.includes('T')) {
                                        // ISO format: "2025-10-21T00:00:00.000000Z" -> "2025-10-21"
                                        dateStr = dayData.date.split('T')[0];
                                      } else if (dayData.date.includes(' ')) {
                                        // DateTime format: "2025-10-21 00:00:00" -> "2025-10-21"
                                        dateStr = dayData.date.split(' ')[0];
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
                                    console.error('Date parsing error in summary:', error, 'Original date:', dayData.date);
                                    return 'Invalid Date';
                                  }
                                })()
                              }
                            </p>
                            <p className="mb-1">
                              <strong>Time:</strong> {selectedTime}
                            </p>
                            <p className="mb-0">
                              <strong>Duration:</strong> {
                                (() => {
                                  const normalizeTime = (time) => {
                                    if (!time) return '';
                                    return time.substring(0, 5);
                                  };
                                  
                                  const slot = getAvailableSlots().find(s => 
                                    normalizeTime(s.start_time) === normalizeTime(selectedTime)
                                  );
                                  return slot ? `${slot.start_time} - ${slot.end_time}` : 'N/A';
                                })()
                              }
                            </p>
                          </div>
                        )}

                        <Button
                          variant="primary"
                          size="lg"
                          className="w-100 py-3"
                          onClick={handleBooking}
                          disabled={loading || !selectedType || !selectedDay || !selectedTime}
                        >
                          {loading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Booking...
                            </>
                          ) : (
                            "Confirm Booking"
                          )}
                        </Button>

                        {/* Debug info */}
                        <div className="mt-3 p-2 bg-light rounded">
                          <small className="text-muted">
                            <strong>Selection Status:</strong><br/>
                            Service Type: {selectedType ? '✓ Selected' : '✗ Not selected'}<br/>
                            Date: {selectedDay ? '✓ Selected' : '✗ Not selected'}<br/>
                            Time: {selectedTime ? '✓ Selected' : '✗ Not selected'}<br/>
                            <strong>Button Status:</strong> {loading || !selectedType || !selectedDay || !selectedTime ? 'Disabled' : 'Enabled'}
                          </small>
                        </div>

                        <div className="text-center mt-3">
                          <small className="text-muted">
                            You will receive a confirmation email with your booking details
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
