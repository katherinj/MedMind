import * as React from "react";
import { Container, Button } from "react-bootstrap";

export default function Landing() {
  return (
    <section className="bg-light py-5 text-center">
      <Container>
        <h1 className="display-4 fw-bold">Welcome to Katherin.io</h1>
        <p className="lead">
          Build stunning web experiences with simplicity and speed.
        </p>
        <Button variant="primary" size="lg" className="mt-3">
          Learn More
        </Button>
      </Container>
    </section>
  );
}
