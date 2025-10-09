import React from "react";
import { Container, Card } from "react-bootstrap";

export default function Confirmation({ location }) {
  // You might pass booking info via state or fetch by booking id query
  return (
    <Container className="py-5">
      <Card className="p-4 text-center">
        <h3>Booking Confirmed</h3>
        <p>Thank you — a confirmation email has been sent with details and booking code.</p>
      </Card>
    </Container>
  );
}
