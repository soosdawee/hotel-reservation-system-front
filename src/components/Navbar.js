import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';

function NavbarComp() {
  const navigate = useNavigate();

  return (
    <Navbar className="navbar" expand="lg" collapseOnSelect>
      <Container className='navbar-container' >
        <Nav className="links-to-pages">
          <Nav.Link href="/hotels" className="links">Search for hotels in the area</Nav.Link>
          <Nav.Link href="/cancel" className="links">Cancel a reservation</Nav.Link>
          <Nav.Link href="/feedback" className="links">Leave a feedback</Nav.Link>
        </Nav>
        
      </Container>
    </Navbar>
  );
}

export default NavbarComp;
