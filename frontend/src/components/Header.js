import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import logo from '../assets/icons/logo.png';

import './Header.scss';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsLoggedIn(!!authToken);
  }, [localStorage.getItem('authToken')]);

  const handleLoginClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  return (
    <Navbar expand='lg' className='bg-body-tertiary header'>
      <Container>
        <Navbar.Brand onClick={() => navigate('/')}>
          <img alt='' src={logo} width='30px' height='30px' className='d-inline-block align-top' />{' '}
          Nome do Produto
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            {isLoggedIn && (
              <>
                <Nav.Link onClick={() => navigate('/chat')}>Chat</Nav.Link>
                <Nav.Link onClick={() => navigate('/about')}>O Projeto</Nav.Link>
                <Nav.Link onClick={() => navigate('/feedback')}>Feedback</Nav.Link>
                <NavDropdown title='Conta' id='basic-nav-dropdown'>
                  <NavDropdown.Item onClick={() => navigate('/profile')}>
                    Informações
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => handleLoginClick()}>Sair</NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Nav.Link onClick={() => navigate('/about')}>O Projeto</Nav.Link>
                <Nav.Link onClick={() => navigate('/feedback')}>Feedback</Nav.Link>
                <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    // <div id='header'>
    //   <div id='header-area' onClick={() => navigate('/')}>
    //     <img id='logo' alt='Logo' src={logo}></img>
    //     <div id='header-title-area'>
    //       <h1 id='title'>Nome do Produto</h1>
    //       <p id='subtitle'>Seu assistente jurídico-trabalhista</p>
    //     </div>
    //   </div>
    //   <div id='header-btn-area'>
    //     {!isLoggedIn && (
    //       <>
    //         <Button
    //           variant='success'
    //           onClick={() => {
    //             navigate('/about');
    //           }}
    //         >
    //           O Projeto
    //         </Button>
    //         <Button variant='success' onClick={() => navigate('/login')}>
    //           Login
    //         </Button>
    //       </>
    //     )}

    //     {isLoggedIn && (
    //       <>
    //         <Button
    //           variant='success'
    //           onClick={() => {
    //             navigate('/about');
    //           }}
    //         >
    //           O Projeto
    //         </Button>
    //         <Button variant='success' onClick={() => navigate('/chat')}>
    //           Chat
    //         </Button>
    //         <Button variant='success' onClick={() => navigate('/profile')}>
    //           Perfil
    //         </Button>
    //         <Button variant='success' onClick={handleLoginClick}>
    //           Sair
    //         </Button>
    //       </>
    //     )}
    //   </div>
    // </div>
  );
}

export default Header;
