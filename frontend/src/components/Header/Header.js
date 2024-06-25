import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import logo from '../../assets/icons/logo.png';
import styles from './Header.module.scss';

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
    <Navbar expand='lg' className={styles['header']}>
      <Container>
        <Navbar.Brand className={styles['title']} onClick={() => navigate('/')}>
          <img className={styles['logo']} alt='Logo' src={logo} />
          AI.dvogado
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className={styles['nav-links']}>
            {isLoggedIn ? (
              <>
                <Nav.Link onClick={() => navigate('/chat')} className={styles['nav-link']}>
                  Chat
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/about')} className={styles['nav-link']}>
                  O Projeto
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/feedback')} className={styles['nav-link']}>
                  Feedback
                </Nav.Link>
                <NavDropdown title='Conta' className={styles['dropdown']}>
                  <NavDropdown.Item onClick={() => navigate('/profile')} className={styles['dropdown-item']}>
                    Informações
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className={styles['dropdown-item']}>
                    Sair
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate('/chat')} className={styles['nav-link']}>
                  Chat
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/about')} className={styles['nav-link']}>
                  O Projeto
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/feedback')} className={styles['nav-link']}>
                  Feedback
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/login')} className={styles['nav-link']}>
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
