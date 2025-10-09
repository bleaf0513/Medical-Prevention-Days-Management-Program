import React from "react";
import { Card, Button } from "react-bootstrap";

export default function ServiceCard({ title, body, actionText = "Book", onAction }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{body}</Card.Text>
        <Button variant="primary" onClick={onAction}>{actionText}</Button>
      </Card.Body>
    </Card>
  );
}
