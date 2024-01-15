
import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { store } from '../App';
import './Nav.css'; 

const NavigationBar = () => {
  const [token, setToken] = useContext(store);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Navbar className="custom-navbar" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">Your Logo/Brand</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
          {!token ? (
              <>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </>
            ) : (
              <>
                {token.user && token.user.role === 'admin' && (
                  <Nav.Link as={Link} to="/adminDashboard">Admin Dashboard</Nav.Link>
                )}
                {token.user && token.user.role === 'user' && (
                  <Nav.Link as={Link} to="/userDashboard">User Dashboard</Nav.Link>
                )}
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
