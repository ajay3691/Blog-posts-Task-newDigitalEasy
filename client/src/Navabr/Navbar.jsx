import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Nav.css'; // Import your custom CSS file

const NavigationBar = () => {
  return (
    <Navbar className="custom-navbar" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Your Logo/Brand</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="register">Register</Nav.Link>
            <Nav.Link href="login">Login</Nav.Link>
            <Nav.Link href="myprofile">My Profile</Nav.Link>
            <Nav.Link href="userDashboard">UserDashboard</Nav.Link>
            <Nav.Link href="adminDashboard">AdminDashboard</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
