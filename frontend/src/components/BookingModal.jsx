import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Row, Col, Card, Alert, Spinner, Badge } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimes } from "react-icons/fa";

export default function BookingModal({ show, onHide }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Data states
  const [categories, setCategories] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [days, setDays] = useState([]);
  
  // Selection states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  
  // Loading states
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (show) {
      loadCategories();
    }
  }, [show]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.getSpecialistSpecialties();
      setCategories(response.data || []);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const loadAppointmentTypes = async (categoryId) => {
    try {
      setLoadingTypes(true);
      const response = await api.getAppointmentTypes();
      const types = response.data || [];
      
      // Filter types that belong to the selected category
      const filteredTypes = types.filter(type => 
        type.specialists && type.specialists.some(specialist => 
          specialist.specialty_id === parseInt(categoryId)
        )
      );
      
      setAppointmentTypes(filteredTypes);
    } catch (err) {
      setError("Failed to load appointment types");
    } finally {
      setLoadingTypes(false);
    }
  };

  const loadAvailableSlots = async (typeId, dayId) => {
    try {
      setLoadingSlots(true);
      const response = await api.getAvailableSlots();
      const days = response.data || [];
      
      // Find the selected day and extract its slots
      const selectedDay = days.find(day => day.id === parseInt(dayId));
      if (!selectedDay || !selectedDay.slots) {
        setAvailableSlots([]);
        return;
      }
      
      // Filter slots for selected type and available capacity
      const filteredSlots = selectedDay.slots.filter(slot => 
        slot.type_id === parseInt(typeId) &&
        slot.booked < slot.capacity
      );
      
      setAvailableSlots(filteredSlots);
    } catch (err) {
      setError("Failed to load available slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const loadDays = async () => {
    try {
      const response = await api.getAvailableSlots();
      const allDays = response.data || [];
      
      // Sort and get next 2 available days
      const sortedDays = allDays
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 2);
      
      setDays(sortedDays);
    } catch (err) {
      setError("Failed to load available days");
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedType("");
    setSelectedDay("");
    setSelectedTime("");
    setAppointmentTypes([]);
    setAvailableSlots([]);
    
    if (categoryId) {
      loadAppointmentTypes(categoryId);
      loadDays();
    }
  };

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
    setSelectedDay("");
    setSelectedTime("");
    setAvailableSlots([]);
  };

  const handleDayChange = (dayId) => {
    setSelectedDay(dayId);
    setSelectedTime("");
    setAvailableSlots([]);
    
    if (selectedType && dayId) {
      loadAvailableSlots(selectedType, dayId);
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = async () => {
    if (!user) {
      setError("Please login to book an appointment");
      return;
    }

    if (!selectedCategory || !selectedType || !selectedDay || !selectedTime) {
      setError("Please select all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Find the selected slot
      const selectedSlot = availableSlots.find(slot => 
        slot.start_time === selectedTime
      );

      if (!selectedSlot) {
        setError("Selected time slot is no longer available");
        return;
      }

      const bookingData = {
        type_id: parseInt(selectedType),
        day_id: parseInt(selectedDay),
        slot_id: selectedSlot.id
      };

      const response = await api.bookAppointment(bookingData);
      
      setSuccess("Booking confirmed successfully!");
      
      // Reset form
      setTimeout(() => {
        setSuccess(null);
        onHide();
        resetForm();
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedType("");
    setSelectedDay("");
    setSelectedTime("");
    setAppointmentTypes([]);
    setAvailableSlots([]);
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const normalizeTime = (time) => {
    return time.substring(0, 5); // Convert "HH:MM:SS" to "HH:MM"
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCalendarAlt className="me-2" />
          Book Appointment
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {success && (
          <Alert variant="success" className="d-flex align-items-center">
            <FaCheckCircle className="me-2" />
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <FaTimes className="me-2" />
            {error}
          </Alert>
        )}

        <Row className="g-3">
          {/* Step 1: Category Selection */}
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h6 className="mb-0">1. Select Category</h6>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center">
                    <Spinner size="sm" />
                    <small className="text-muted d-block mt-2">Loading categories...</small>
                  </div>
                ) : (
                  <Form.Select 
                    value={selectedCategory} 
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="">Choose a category...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Step 2: Appointment Type Selection */}
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h6 className="mb-0">2. Select Service</h6>
              </Card.Header>
              <Card.Body>
                {loadingTypes ? (
                  <div className="text-center">
                    <Spinner size="sm" />
                    <small className="text-muted d-block mt-2">Loading services...</small>
                  </div>
                ) : (
                  <Form.Select 
                    value={selectedType} 
                    onChange={(e) => handleTypeChange(e.target.value)}
                    disabled={!selectedCategory}
                  >
                    <option value="">Choose a service...</option>
                    {appointmentTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {type.duration}min
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Step 3: Date Selection */}
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h6 className="mb-0">3. Select Date</h6>
              </Card.Header>
              <Card.Body>
                <Form.Select 
                  value={selectedDay} 
                  onChange={(e) => handleDayChange(e.target.value)}
                  disabled={!selectedType}
                >
                  <option value="">Choose a date...</option>
                  {days.map(day => (
                    <option key={day.id} value={day.id}>
                      {(() => {
                        try {
                          let dateStr = day.date;
                          if (typeof day.date === 'string') {
                            if (day.date.includes('T')) {
                              dateStr = day.date.split('T')[0];
                            } else if (day.date.includes(' ')) {
                              dateStr = day.date.split(' ')[0];
                            }
                          }
                          const [year, month, dayNum] = dateStr.split('-');
                          const date = new Date(year, month - 1, dayNum);
                          return date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          });
                        } catch (error) {
                          return 'Invalid Date';
                        }
                      })()}
                    </option>
                  ))}
                </Form.Select>
              </Card.Body>
            </Card>
          </Col>

          {/* Step 4: Time Selection */}
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h6 className="mb-0">4. Select Time</h6>
              </Card.Header>
              <Card.Body>
                {loadingSlots ? (
                  <div className="text-center">
                    <Spinner size="sm" />
                    <small className="text-muted d-block mt-2">Loading times...</small>
                  </div>
                ) : (
                  <Form.Select 
                    value={selectedTime} 
                    onChange={(e) => handleTimeChange(e.target.value)}
                    disabled={!selectedDay}
                  >
                    <option value="">Choose a time...</option>
                    {availableSlots.map(slot => (
                      <option key={slot.id} value={slot.start_time}>
                        {normalizeTime(slot.start_time)} - {normalizeTime(slot.end_time)}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Booking Summary */}
        {selectedCategory && selectedType && selectedDay && selectedTime && (
          <Card className="mt-4 border-primary">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">Booking Summary</h6>
            </Card.Header>
            <Card.Body>
              <Row className="g-2">
                <Col md={6}>
                  <small className="text-muted">Category:</small>
                  <div className="fw-medium">
                    {categories.find(c => c.id === parseInt(selectedCategory))?.name}
                  </div>
                </Col>
                <Col md={6}>
                  <small className="text-muted">Service:</small>
                  <div className="fw-medium">
                    {appointmentTypes.find(t => t.id === parseInt(selectedType))?.name}
                  </div>
                </Col>
                <Col md={6}>
                  <small className="text-muted">Date:</small>
                  <div className="fw-medium">
                    {(() => {
                      const day = days.find(d => d.id === parseInt(selectedDay));
                      if (!day) return 'N/A';
                      try {
                        let dateStr = day.date;
                        if (typeof day.date === 'string') {
                          if (day.date.includes('T')) {
                            dateStr = day.date.split('T')[0];
                          } else if (day.date.includes(' ')) {
                            dateStr = day.date.split(' ')[0];
                          }
                        }
                        const [year, month, dayNum] = dateStr.split('-');
                        const date = new Date(year, month - 1, dayNum);
                        return date.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        });
                      } catch (error) {
                        return 'Invalid Date';
                      }
                    })()}
                  </div>
                </Col>
                <Col md={6}>
                  <small className="text-muted">Time:</small>
                  <div className="fw-medium">
                    {normalizeTime(selectedTime)} - {normalizeTime(availableSlots.find(s => s.start_time === selectedTime)?.end_time || '')}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleBooking}
          disabled={loading || !selectedCategory || !selectedType || !selectedDay || !selectedTime}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Booking...
            </>
          ) : (
            <>
              <FaCheckCircle className="me-2" />
              Confirm Booking
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
