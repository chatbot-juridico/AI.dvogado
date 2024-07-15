import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
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
      <h1 className={styles['title']}>AI.dvogado</h1>
      <Container>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'></Nav> {/* Espaço para o alinhamento à direita */}
          <Nav className={styles['navbar-nav']}>
            <Nav.Link onClick={() => navigate('/')} className={styles['nav-link']}>
              Página Inicial
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/chat')} className={styles['nav-link']}>
              Chat
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/about')} className={styles['nav-link']}>
              Sobre
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/feedback')} className={styles['nav-link']}>
              Feedback
            </Nav.Link>
            {isLoggedIn ? (
              <NavDropdown title='Conta' className={styles['dropdown']}>
                <NavDropdown.Item onClick={() => navigate('/profile')} className={styles['dropdown-item']}>
                  Informações
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className={styles['dropdown-item']}>
                  Sair
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link onClick={() => navigate('/login')} className={styles['nav-link']}>
                Entrar
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
