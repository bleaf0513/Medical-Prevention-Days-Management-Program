import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ServiceCard from "../components/ServiceCard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6}>
            <h1 className="display-5">Book Your Prevention Day Appointment</h1>
            <p className="lead">Early detection. Better protection.</p>
            <Button size="lg" onClick={() => navigate("/booking")}>Book Now</Button>
          </Col>
          <Col md={6} className="text-center">
            <img src="/logo.png" alt="clinic" className="img-fluid rounded" style={{ maxHeight: 280 }} />
          </Col>
        </Row>

        <Row className="mt-5 g-4">
          <Col md={4}>
            <ServiceCard
              title="Health Screening Programs"
              body="Comprehensive checkups for various health needs."
              onAction={() => navigate("/booking")}
            />
          </Col>
          <Col md={4}>
            <ServiceCard
              title="Vaccination Days"
              body="Protection against preventable diseases."
              onAction={() => navigate("/booking")}
            />
          </Col>
          <Col md={4}>
            <ServiceCard
              title="Corporate Prevention Programs"
              body="Health initiatives for businesses."
              onAction={() => navigate("/booking")}
            />
          </Col>
        </Row>
      </Container>

      <Container className="mt-5">
        <h5 className="text-center">Trusted by</h5>
        <div className="d-flex justify-content-center gap-4 my-3">
          <div>HealthCare</div>
          <div>Medical Center</div>
          <div>Wellness Clinic</div>
        </div>
      </Container>

      <Footer />
    </div>
  );
}
