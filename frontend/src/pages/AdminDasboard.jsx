import React, { useEffect, useState, useContext } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  Modal, 
  Alert, 
  Badge,
  Tab,
  Tabs,
  Spinner
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUsers, 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd,
  FaSearch,
  FaEye,
  FaCheck,
  FaTimes
} from "react-icons/fa";

export default function AdminDashboard() {
  const { admin, logoutAdmin } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Data states
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [days, setDays] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [allSpecialists, setAllSpecialists] = useState([]);
  const [specialistSlots, setSpecialistSlots] = useState([]);
  const [specialistSpecialties, setSpecialistSpecialties] = useState([]);
  const [administrators, setAdministrators] = useState([]);

  // Form states
  const [showAppointmentTypeModal, setShowAppointmentTypeModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showSpecialistModal, setShowSpecialistModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  // Form data
  const [appointmentTypeForm, setAppointmentTypeForm] = useState({
    name: "",
    average_duration: 30,
    specialists_count: 1,
    description: ""
  });

  const [dayForm, setDayForm] = useState({
    date: "",
    start_time: "09:00",
    end_time: "17:00",
    break_start: "",
    break_end: ""
  });

  const [specialistForm, setSpecialistForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    specialty_id: ""
  });

  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [adminForm, setAdminForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('Loading data...');
      console.log('Admin token:', localStorage.getItem('admin_token'));
      
      const [bookingsRes, usersRes, typesRes, daysRes, specialistsRes, specialistSlotsRes, specialtiesRes, adminsRes] = await Promise.all([
        api.getAdminBookings(),
        api.getUsers(),
        api.getAdminAppointmentTypes(),
        api.getAdminDays(),
        api.getSpecialists(),
        api.getSpecialistSlots(),
        api.getSpecialistSpecialties(),
        api.getAdministrators()
      ]);

      console.log('Data loaded successfully');
      setBookings(bookingsRes.data || []);
      setUsers(usersRes.data || []);
      setAppointmentTypes(typesRes.data || []);
      setDays(daysRes.data || []);
      setAllSpecialists(specialistsRes.data || []);
      setSpecialistSlots(specialistSlotsRes.data || []);
      setSpecialistSpecialties(specialtiesRes.data || []);
      setAdministrators(adminsRes.data?.administrators || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setMsg({ type: "danger", text: "Failed to load data: " + (error?.response?.data?.message || error.message) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      loadData();
    }
  }, [admin]);

  // Handle appointment type creation/update
  const handleAppointmentTypeSubmit = async (e) => {
    e.preventDefault();
    
    // Check for duplicate names
    const isDuplicate = appointmentTypes.some(type => 
      type.name.toLowerCase() === appointmentTypeForm.name.toLowerCase() && 
      (!editingItem || type.id !== editingItem.id)
    );
    
    if (isDuplicate) {
      setMsg({ type: "danger", text: "An appointment type with this name already exists" });
      return;
    }
    
    try {
      const formData = {
        ...appointmentTypeForm,
        specialists_count: selectedSpecialists.length, // Use actual selected count
        selected_specialists: selectedSpecialists,
        selected_categories: selectedCategories
      };
      
      if (editingItem) {
        await api.updateAppointmentType(editingItem.id, formData);
        setMsg({ type: "success", text: "Appointment type updated successfully" });
      } else {
        await api.createAppointmentType(formData);
        setMsg({ type: "success", text: "Appointment type created successfully" });
      }
      setShowAppointmentTypeModal(false);
      resetAppointmentTypeForm();
      loadData();
    } catch (error) {
      setMsg({ type: "danger", text: error?.response?.data?.message || "Failed to save appointment type" });
    }
  };

  // Handle appointment type deletion
  const handleDeleteAppointmentType = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment type?")) {
      try {
        await api.deleteAppointmentType(id);
        setMsg({ type: "success", text: "Appointment type deleted successfully" });
        loadData();
      } catch (error) {
        setMsg({ type: "danger", text: "Failed to delete appointment type" });
      }
    }
  };

  // Handle appointment type editing
  const handleEditAppointmentType = (type) => {
    setEditingItem(type);
    setAppointmentTypeForm({
      name: type.name,
      average_duration: type.average_duration,
      specialists_count: type.specialists_count,
      description: type.description || ""
    });
    setSelectedSpecialists(type.specialists?.map(s => s.id) || []);
    
    // Set the categories based on all specialists' categories
    const categories = [...new Set(
      type.specialists?.map(s => s.specialty_id?.toString()).filter(Boolean) || []
    )];
    setSelectedCategories(categories);
    
    setShowAppointmentTypeModal(true);
  };

  // Handle day creation/update
  const handleDaySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        console.log('Updating day with ID:', editingItem.id);
        if (!editingItem.id) {
          setMsg({ type: "danger", text: "Invalid day ID for update" });
          return;
        }
        await api.updateDay(editingItem.id, dayForm);
        setMsg({ type: "success", text: "Day updated successfully" });
      } else {
        console.log('Creating new day');
        await api.createDay(dayForm);
        setMsg({ type: "success", text: "Day created and slots generated successfully" });
      }
      setShowDayModal(false);
      resetDayForm();
      loadData();
    } catch (error) {
      console.error('Day save error:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.errors || "Failed to save day";
      setMsg({ type: "danger", text: `Failed to save day: ${errorMessage}` });
    }
  };

  // Handle day editing
  const handleEditDay = async (day) => {
    console.log('Editing day:', day);
    if (!day || !day.id) {
      setMsg({ type: "danger", text: "Invalid day data" });
      return;
    }
    
    try {
      // Verify the day still exists before editing
      const dayRes = await api.getAdminDay(day.id);
      const currentDay = dayRes.data.day;
      
      setEditingItem(currentDay);
      setDayForm({
        date: currentDay.date,
        start_time: currentDay.start_time,
        end_time: currentDay.end_time,
        break_start: currentDay.break_start || "",
        break_end: currentDay.break_end || ""
      });
      setShowDayModal(true);
    } catch (error) {
      console.error('Day verification error:', error);
      setMsg({ type: "danger", text: "Day not found or has been deleted" });
      // Refresh the days list to remove any stale data
      loadData();
    }
  };

  // Handle day deletion
  const handleDeleteDay = async (id) => {
    if (window.confirm("Are you sure you want to delete this day? This will also delete all associated slots and bookings.")) {
      try {
        await api.deleteDay(id);
        setMsg({ type: "success", text: "Day deleted successfully" });
        loadData();
      } catch (error) {
        setMsg({ type: "danger", text: "Failed to delete day" });
      }
    }
  };

  // Handle specialist creation/update
  const handleSpecialistSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        console.log('Updating specialist with ID:', editingItem.id, 'Data:', specialistForm);
        await api.updateSpecialist(editingItem.id, specialistForm);
        setMsg({ type: "success", text: "Specialist updated successfully" });
      } else {
        console.log('Creating specialist with data:', specialistForm);
        await api.createSpecialist(specialistForm);
        setMsg({ type: "success", text: "Specialist created successfully" });
      }
      setShowSpecialistModal(false);
      resetSpecialistForm();
      loadData();
    } catch (error) {
      console.error('Specialist save error:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.errors || `Failed to ${editingItem ? 'update' : 'create'} specialist`;
      setMsg({ type: "danger", text: errorMessage });
    }
  };

  // Handle specialist editing
  const handleEditSpecialist = (specialist) => {
    console.log('Editing specialist:', specialist);
    setEditingItem(specialist);
    setSpecialistForm({
      first_name: specialist.first_name,
      last_name: specialist.last_name,
      email: specialist.email || "",
      specialty_id: specialist.specialty_id || ""
    });
    setShowSpecialistModal(true);
  };

  // Handle specialist deletion
  const handleDeleteSpecialist = async (id) => {
    if (window.confirm("Are you sure you want to delete this specialist?")) {
      try {
        await api.deleteSpecialist(id);
        setMsg({ type: "success", text: "Specialist deleted successfully" });
        loadData();
      } catch (error) {
        setMsg({ type: "danger", text: "Failed to delete specialist" });
      }
    }
  };

  // Handle administrator editing
  const handleEditAdministrator = (admin) => {
    setEditingItem(admin);
    setAdminForm({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      password: ""
    });
    setShowAdminModal(true);
  };

  // Handle administrator deletion
  const handleDeleteAdministrator = async (id) => {
    if (window.confirm("Are you sure you want to delete this administrator?")) {
      try {
        await api.deleteAdministrator(id);
        setMsg({ type: "success", text: "Administrator deleted successfully" });
        loadData();
      } catch (error) {
        setMsg({ type: "danger", text: "Failed to delete administrator" });
      }
    }
  };

  // Handle admin registration/update
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateAdministrator(editingItem.id, adminForm);
        setMsg({ type: "success", text: "Administrator updated successfully" });
      } else {
        await api.adminRegister(adminForm);
        setMsg({ type: "success", text: "Administrator created successfully" });
      }
      setShowAdminModal(false);
      resetAdminForm();
      loadData();
    } catch (error) {
      setMsg({ type: "danger", text: "Failed to save administrator" });
    }
  };

  // Handle slot regeneration
  const handleRegenerateSlots = async (dayId) => {
    try {
      await api.generateSlots(dayId);
      setMsg({ type: "success", text: "Slots regenerated successfully" });
      loadData();
    } catch (error) {
      setMsg({ type: "danger", text: "Failed to regenerate slots" });
    }
  };

  // Handle booking actions
  const handleMarkAttendance = async (bookingId, attended) => {
    try {
      await api.markAttendance(bookingId, { attended });
      setMsg({ type: "success", text: `Attendance marked as ${attended ? 'present' : 'absent'}` });
      loadData();
    } catch (error) {
      setMsg({ type: "danger", text: "Failed to update attendance" });
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.cancelBooking(bookingId);
        setMsg({ type: "success", text: "Booking cancelled successfully" });
        loadData();
      } catch (error) {
        setMsg({ type: "danger", text: "Failed to cancel booking" });
      }
    }
  };

  // Reset forms
  const resetAppointmentTypeForm = () => {
    setAppointmentTypeForm({
      name: "",
      average_duration: 30,
      specialists_count: 1,
      description: ""
    });
    setSelectedSpecialists([]);
    setSelectedCategories([]);
    setEditingItem(null);
  };

  const resetDayForm = () => {
    setDayForm({
      date: "",
      start_time: "09:00",
      end_time: "17:00",
      break_start: "",
      break_end: ""
    });
    setEditingItem(null);
  };

  const resetSpecialistForm = () => {
    setSpecialistForm({
      first_name: "",
      last_name: "",
      email: "",
      specialty_id: ""
    });
    setEditingItem(null);
  };

  const resetAdminForm = () => {
    setAdminForm({
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    });
    setEditingItem(null);
  };

  // Filter data based on search
  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.booking_code?.toLowerCase().includes(query) ||
      booking.visitor_first_name?.toLowerCase().includes(query) ||
      booking.visitor_last_name?.toLowerCase().includes(query) ||
      booking.type_name?.toLowerCase().includes(query)
    );
  });

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  // Statistics
  const stats = {
    totalBookings: bookings.length,
    totalUsers: users.length,
    totalAppointmentTypes: appointmentTypes.length,
    totalDays: days.length,
    totalSpecialists: allSpecialists.length,
    confirmedBookings: bookings.filter(b => b.confirmed).length,
    pendingBookings: bookings.filter(b => !b.confirmed).length
  };

  if (!admin) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'var(--bg-secondary)' }}>
        <div className="text-center">
          <h3 className="text-muted">Please log in to access the admin dashboard</h3>
          <p className="text-muted">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'var(--bg-secondary)' }}>
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="text-primary mb-1">Admin Dashboard</h2>
                <p className="text-muted mb-0">Welcome back, {admin?.first_name}!</p>
              </div>
              <Button variant="outline-danger" onClick={logoutAdmin}>
                <FaTimes className="me-2" />
                Logout
              </Button>
            </div>
          </Col>
        </Row>

        {/* Alert Messages */}
        {msg && (
          <Alert variant={msg.type} dismissible onClose={() => setMsg(null)}>
            {msg.text}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={2}>
            <Card className="text-center h-100">
              <Card.Body>
                <FaUsers className="text-primary mb-2" style={{ fontSize: '2rem' }} />
                <h4>{stats.totalUsers}</h4>
                <small className="text-muted">Total Users</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center h-100">
              <Card.Body>
                <FaCalendarAlt className="text-success mb-2" style={{ fontSize: '2rem' }} />
                <h4>{stats.totalBookings}</h4>
                <small className="text-muted">Total Bookings</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center h-100">
              <Card.Body>
                <FaCheck className="text-info mb-2" style={{ fontSize: '2rem' }} />
                <h4>{stats.confirmedBookings}</h4>
                <small className="text-muted">Confirmed</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center h-100">
              <Card.Body>
                <FaClock className="text-warning mb-2" style={{ fontSize: '2rem' }} />
                <h4>{stats.pendingBookings}</h4>
                <small className="text-muted">Pending</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center h-100">
              <Card.Body>
                <FaUserMd className="text-danger mb-2" style={{ fontSize: '2rem' }} />
                <h4>{stats.totalAppointmentTypes}</h4>
                <small className="text-muted">Appointment Types</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center h-100">
              <Card.Body>
                <FaUserMd className="text-info mb-2" style={{ fontSize: '2rem' }} />
                <h4>{stats.totalSpecialists}</h4>
                <small className="text-muted">Specialists</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search Bar */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Control
              placeholder="Search bookings, users, or appointment types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option value="all">All Data</option>
              <option value="bookings">Bookings Only</option>
              <option value="users">Users Only</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button variant="primary" onClick={loadData} disabled={loading}>
              {loading ? <Spinner size="sm" /> : <FaSearch />} Refresh Data
            </Button>
          </Col>
        </Row>

        {/* Main Content Tabs */}
        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
          {/* Overview Tab */}
          <Tab eventKey="overview" title="Overview">
            <Row>
              <Col md={6}>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Bookings</h5>
                    <Badge bg="primary">{filteredBookings.length}</Badge>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {filteredBookings.slice(0, 10).map(booking => (
                        <div key={booking.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <div>
                            <strong>{booking.visitor_first_name} {booking.visitor_last_name}</strong>
                            <br />
                            <small className="text-muted">{booking.type_name} - {booking.day_date}</small>
                          </div>
                          <div className="text-end">
                            <Badge bg={booking.confirmed ? "success" : "warning"}>
                              {booking.confirmed ? "Confirmed" : "Pending"}
                            </Badge>
                            <br />
                            <small className="text-muted">{booking.time}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Users</h5>
                    <Badge bg="info">{filteredUsers.length}</Badge>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {filteredUsers.slice(0, 10).map(user => (
                        <div key={user.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                          <div>
                            <strong>{user.first_name} {user.last_name}</strong>
                            <br />
                            <small className="text-muted">{user.email}</small>
                          </div>
                          <div className="text-end">
                            <small className="text-muted">
                              {new Date(user.created_at).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* Bookings Tab */}
          <Tab eventKey="bookings" title="Bookings Management">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">All Bookings</h5>
                <Badge bg="primary">{filteredBookings.length}</Badge>
              </Card.Header>
              <Card.Body>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Booking Code</th>
            <th>Visitor</th>
                      <th>Email</th>
                      <th>Appointment Type</th>
                      <th>Date</th>
            <th>Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="8" className="text-center"><Spinner /> Loading...</td></tr>
                    ) : filteredBookings.length === 0 ? (
                      <tr><td colSpan="8" className="text-center">No bookings found</td></tr>
                    ) : (
                      filteredBookings.map(booking => (
                        <tr key={booking.id}>
                          <td><code>{booking.booking_code}</code></td>
                          <td>{booking.visitor_first_name} {booking.visitor_last_name}</td>
                          <td>{booking.visitor_email}</td>
                          <td>{booking.type_name}</td>
                          <td>{booking.day_date}</td>
                          <td>{booking.time}</td>
                          <td>
                            <Badge bg={booking.confirmed ? "success" : "warning"}>
                              {booking.confirmed ? "Confirmed" : "Pending"}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                size="sm" 
                                variant={booking.attended ? "success" : "outline-success"}
                                onClick={() => handleMarkAttendance(booking.id, !booking.attended)}
                                title="Mark Attendance"
                              >
                                <FaCheck />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline-danger"
                                onClick={() => handleCancelBooking(booking.id)}
                                title="Cancel Booking"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          {/* Users Tab */}
          <Tab eventKey="users" title="Users Management">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">All Users</h5>
                <Badge bg="info">{filteredUsers.length}</Badge>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Registration Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6" className="text-center"><Spinner /> Loading...</td></tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan="6" className="text-center">No users found</td></tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.first_name} {user.last_name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td>
                            <Button size="sm" variant="outline-primary">
                              <FaEye />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          {/* Appointment Types Tab */}
          <Tab eventKey="appointment-types" title="Appointment Types">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Appointment Types</h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowAppointmentTypeModal(true)}
                >
                  <FaPlus className="me-1" />
                  Add Type
                </Button>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Duration (min)</th>
                      <th>Specialist Categories</th>
                      <th>Specialists Count</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
        <tbody>
                    {loading ? (
                      <tr><td colSpan="6" className="text-center"><Spinner /> Loading...</td></tr>
                    ) : appointmentTypes.length === 0 ? (
                      <tr><td colSpan="6" className="text-center">No appointment types found</td></tr>
                    ) : (
                      appointmentTypes.map(type => {
                        // Get unique categories from specialists
                        const categories = [...new Set(
                          type.specialists?.map(s => s.specialty?.name).filter(Boolean) || []
                        )];
                        
                        return (
                          <tr key={type.id}>
                            <td><strong>{type.name}</strong></td>
                            <td>{type.average_duration}</td>
                            <td>
                              {categories.length > 0 ? (
                                <div>
                                  {categories.map(category => (
                                    <Badge key={category} bg="info" className="me-1 mb-1">
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted">No categories</span>
                              )}
                            </td>
                            <td>{type.specialists?.length || 0}</td>
                            <td>{type.description}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline-primary"
                                  onClick={() => handleEditAppointmentType(type)}
                                  title="Edit Appointment Type"
                                >
                                  <FaEdit />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-danger"
                                  onClick={() => handleDeleteAppointmentType(type.id)}
                                  title="Delete Appointment Type"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          {/* Admin Management Tab */}
          <Tab eventKey="admins" title="Admin Management">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Administrators</h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowAdminModal(true)}
                >
                  <FaPlus className="me-1" />
                  Add Admin
                </Button>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" className="text-center"><Spinner /> Loading...</td></tr>
                    ) : administrators.length === 0 ? (
                      <tr><td colSpan="4" className="text-center">No administrators found</td></tr>
                    ) : (
                      administrators.map(admin => (
                        <tr key={admin.id}>
                          <td>{admin.id}</td>
                          <td><strong>{admin.first_name} {admin.last_name}</strong></td>
                          <td>{admin.email}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={() => handleEditAdministrator(admin)}
                                title="Edit Administrator"
                              >
                                <FaEdit />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline-danger"
                                onClick={() => handleDeleteAdministrator(admin.id)}
                                title="Delete Administrator"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          {/* Registered Specialists Tab */}
          <Tab eventKey="registered-specialists" title="Registered Specialists">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Registered Specialists</h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowSpecialistModal(true)}
                >
                  <FaPlus className="me-1" />
                  Add Specialist
                </Button>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Specialty</th>
                      <th>Total Slots</th>
                      <th>Available Slots</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="7" className="text-center"><Spinner /> Loading...</td></tr>
                    ) : allSpecialists.length === 0 ? (
                      <tr><td colSpan="7" className="text-center">No specialists found</td></tr>
                    ) : (
                      allSpecialists.map(specialist => {
                        // Check for duplicates (same name and same time slots)
                        const duplicateSpecialists = allSpecialists.filter(s => 
                          s.first_name === specialist.first_name && 
                          s.last_name === specialist.last_name && 
                          s.id !== specialist.id
                        );
                        
                        const hasDuplicate = duplicateSpecialists.length > 0;
                        const totalSlots = specialist.specialist_slots?.length || 0;
                        const availableSlots = specialist.specialist_slots?.filter(slot => slot.is_available).length || 0;
                        
                        return (
                          <tr key={specialist.id} className={hasDuplicate ? 'table-warning' : ''}>
                            <td>
                              <strong className={hasDuplicate ? 'text-danger' : ''}>
                                {specialist.first_name} {specialist.last_name}
                                {hasDuplicate && <Badge bg="danger" className="ms-2">Duplicate</Badge>}
                              </strong>
                            </td>
                            <td>{specialist.email}</td>
                            <td>
                              {specialist.specialty?.name || (
                                <span className="text-muted">Unassigned</span>
                              )}
                            </td>
                            <td>
                              <Badge bg="info">{totalSlots}</Badge>
                            </td>
                            <td>
                              <Badge bg={availableSlots > 0 ? "success" : "secondary"}>{availableSlots}</Badge>
                            </td>
                            <td>
                              {availableSlots > 0 ? (
                                <Badge bg="success">Available</Badge>
                              ) : totalSlots > 0 ? (
                                <Badge bg="warning">Fully Booked</Badge>
                              ) : (
                                <Badge bg="secondary">No Slots</Badge>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline-primary"
                                  onClick={() => handleEditSpecialist(specialist)}
                                  title="Edit Specialist"
                                >
                                  <FaEdit />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-danger"
                                  onClick={() => handleDeleteSpecialist(specialist.id)}
                                  title="Delete Specialist"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          {/* Specialists Slots Tab */}
          <Tab eventKey="specialists-slots" title="Specialists Slots">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Specialists & Their Appointment Types</h5>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Specialist Name</th>
                      <th>Specialty</th>
                      <th>Appointment Type</th>
                      <th>Meeting Count</th>
                      <th>Last Meeting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center"><Spinner /> Loading...</td></tr>
                    ) : specialistSlots.length === 0 ? (
                      <tr><td colSpan="5" className="text-center">No specialist slots found</td></tr>
                    ) : (
                      specialistSlots.map(specialist => (
                        <tr key={specialist.id}>
                          <td><strong>{specialist.first_name} {specialist.last_name}</strong></td>
                          <td>
                            {specialist.specialty?.name || (
                              <span className="text-muted">Unassigned</span>
                            )}
                          </td>
                          <td>
                            {specialist.appointment_type?.name || (
                              <span className="text-muted">Unassigned</span>
                            )}
                          </td>
                          <td>
                            <Badge bg="primary">{specialist.specialist_slots?.reduce((sum, slot) => sum + (slot.meeting_count || 0), 0) || 0}</Badge>
                          </td>
                          <td>
                            {specialist.specialist_slots?.find(slot => slot.last_meeting_at)?.last_meeting_at ? 
                              new Date(specialist.specialist_slots.find(slot => slot.last_meeting_at).last_meeting_at).toLocaleDateString() :
                              <span className="text-muted">Never</span>
                            }
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          {/* Days Management Tab */}
          <Tab eventKey="days" title="Days Management">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Prevention Days</h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowDayModal(true)}
                >
                  <FaPlus className="me-1" />
                  Add Day
                </Button>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Break</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center"><Spinner /> Loading...</td></tr>
                    ) : days.length === 0 ? (
                      <tr><td colSpan="5" className="text-center">No days found</td></tr>
                    ) : (
                      days.map(day => (
                        <tr key={day.id}>
                          <td><strong>{new Date(day.date).toISOString().split('T')[0]}</strong></td>
                          <td>{day.start_time}</td>
                          <td>{day.end_time}</td>
                          <td>
                            {day.break_start && day.break_end ? 
                              `${day.break_start} - ${day.break_end}` : 
                              'No break'
                            }
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={() => handleEditDay(day)}
                                title="Edit Day"
                              >
                                <FaEdit />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline-success"
                                onClick={() => handleRegenerateSlots(day.id)}
                                title="Regenerate Slots"
                              >
                                <FaClock />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline-danger"
                                onClick={() => handleDeleteDay(day.id)}
                                title="Delete Day"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        {/* Appointment Type Modal */}
        <Modal show={showAppointmentTypeModal} onHide={() => setShowAppointmentTypeModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Appointment Type</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAppointmentTypeSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={appointmentTypeForm.name}
                  onChange={(e) => setAppointmentTypeForm({...appointmentTypeForm, name: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Average Duration (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={appointmentTypeForm.average_duration}
                  onChange={(e) => setAppointmentTypeForm({...appointmentTypeForm, average_duration: parseInt(e.target.value)})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Select Specialist Categories</Form.Label>
                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem', padding: '10px' }}>
                  {specialistSpecialties.map(specialty => (
                    <Form.Check
                      key={specialty.id}
                      type="checkbox"
                      id={`category-${specialty.id}`}
                      label={`${specialty.name} - ${specialty.description}`}
                      checked={selectedCategories.includes(specialty.id.toString())}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, specialty.id.toString()]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== specialty.id.toString()));
                          // Remove specialists from this category when category is unchecked
                          const specialistsToRemove = allSpecialists
                            .filter(s => s.specialty_id == specialty.id)
                            .map(s => s.id);
                          setSelectedSpecialists(selectedSpecialists.filter(id => !specialistsToRemove.includes(id)));
                        }
                      }}
                      className="mb-2"
                    />
                  ))}
                </div>
                <Form.Text className="text-muted">
                  Selected categories: {selectedCategories.length} | Selected specialists: {selectedSpecialists.length}
                </Form.Text>
              </Form.Group>

              {selectedCategories.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Specialists from Selected Categories</Form.Label>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem', padding: '10px' }}>
                    {selectedCategories.map(categoryId => {
                      const category = specialistSpecialties.find(s => s.id.toString() === categoryId);
                      const categorySpecialists = allSpecialists.filter(s => s.specialty_id == categoryId);
                      
                      return (
                        <div key={categoryId} className="mb-3">
                          <h6 className="text-primary mb-2">{category?.name}</h6>
                          {categorySpecialists.map(specialist => (
                            <Form.Check
                              key={specialist.id}
                              type="checkbox"
                              id={`specialist-${specialist.id}`}
                              label={`${specialist.first_name} ${specialist.last_name}`}
                              checked={selectedSpecialists.includes(specialist.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSpecialists([...selectedSpecialists, specialist.id]);
                                } else {
                                  setSelectedSpecialists(selectedSpecialists.filter(id => id !== specialist.id));
                                }
                              }}
                              className="mb-1 ms-3"
                            />
                          ))}
                          {categorySpecialists.length === 0 && (
                            <p className="text-muted mb-0 ms-3">No specialists available in this category.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={appointmentTypeForm.description}
                  onChange={(e) => setAppointmentTypeForm({...appointmentTypeForm, description: e.target.value})}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAppointmentTypeModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Appointment Type
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Day Modal */}
        <Modal show={showDayModal} onHide={() => {
          setShowDayModal(false);
          setEditingItem(null);
          resetDayForm();
        }}>
          <Modal.Header closeButton>
            <Modal.Title>{editingItem ? 'Edit Prevention Day' : 'Add Prevention Day'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleDaySubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dayForm.date}
                  onChange={(e) => setDayForm({...dayForm, date: e.target.value})}
                  required
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={dayForm.start_time}
                      onChange={(e) => setDayForm({...dayForm, start_time: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={dayForm.end_time}
                      onChange={(e) => setDayForm({...dayForm, end_time: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Break Start (Optional)</Form.Label>
                    <Form.Control
                      type="time"
                      value={dayForm.break_start}
                      onChange={(e) => setDayForm({...dayForm, break_start: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Break End (Optional)</Form.Label>
                    <Form.Control
                      type="time"
                      value={dayForm.break_end}
                      onChange={(e) => setDayForm({...dayForm, break_end: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => {
                setShowDayModal(false);
                setEditingItem(null);
                resetDayForm();
              }}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingItem ? 'Update Day' : 'Create Day & Generate Slots'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Admin Registration Modal */}
        <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingItem ? 'Edit Administrator' : 'Add Administrator'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAdminSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={adminForm.first_name}
                      onChange={(e) => setAdminForm({...adminForm, first_name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={adminForm.last_name}
                      onChange={(e) => setAdminForm({...adminForm, last_name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                  required={!editingItem}
                  minLength={6}
                />
                <Form.Text className="text-muted">
                  {editingItem ? "Leave blank to keep current password" : "Password must be at least 6 characters long."}
                </Form.Text>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAdminModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingItem ? 'Update Administrator' : 'Create Administrator'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Specialist Registration Modal */}
        <Modal show={showSpecialistModal} onHide={() => {
          setShowSpecialistModal(false);
          setEditingItem(null);
          resetSpecialistForm();
        }}>
          <Modal.Header closeButton>
            <Modal.Title>{editingItem ? 'Edit Specialist' : 'Add Specialist'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSpecialistSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={specialistForm.first_name}
                      onChange={(e) => setSpecialistForm({...specialistForm, first_name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={specialistForm.last_name}
                      onChange={(e) => setSpecialistForm({...specialistForm, last_name: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={specialistForm.email}
                  onChange={(e) => setSpecialistForm({...specialistForm, email: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Specialty</Form.Label>
                <Form.Select
                  value={specialistForm.specialty_id}
                  onChange={(e) => setSpecialistForm({...specialistForm, specialty_id: e.target.value})}
                  required
                >
                  <option value="">Select Specialty</option>
                  {specialistSpecialties.map(specialty => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Select the specialty area for this specialist.
                </Form.Text>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => {
                setShowSpecialistModal(false);
                setEditingItem(null);
                resetSpecialistForm();
              }}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingItem ? 'Update Specialist' : 'Create Specialist'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
    </Container>
    </div>
  );
}
