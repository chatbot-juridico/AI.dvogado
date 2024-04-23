import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from '../assets/icons/logo.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, [localStorage.getItem('authToken')]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <Navbar expand='lg' className='header'>
      <Container>
        <Navbar.Brand onClick={() => navigate('/')}>
          <img alt='Logo' src={logo} className='logo' />
          Nome do Produto
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='nav-links'>
            {isLoggedIn ? (
              <>
                <Nav.Link onClick={() => navigate('/chat')} className='nav-link'>
                  Chat
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/about')} className='nav-link'>
                  O Projeto
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/feedback')} className='nav-link'>
                  Feedback
                </Nav.Link>
                <NavDropdown title='Conta' id='basic-nav-dropdown'>
                  <NavDropdown.Item onClick={() => navigate('/profile')} className='dropdown-item'>
                    Informações
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className='dropdown-item'>
                    Sair
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate('/about')} className='nav-link'>
                  O Projeto
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/feedback')} className='nav-link'>
                  Feedback
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/login')} className='nav-link'>
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
