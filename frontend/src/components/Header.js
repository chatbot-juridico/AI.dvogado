import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import logo from '../assets/icons/logo.png';

import './Header.css';

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
    <div id='header'>
      <div id='header-area' onClick={() => navigate('/')}>
        <img id='logo' alt='Logo' src={logo}></img>
        <div id='header-title-area'>
          <h1 id='title'>Nome do Produto</h1>
          <p id='subtitle'>Seu assistente jurídico-trabalhista</p>
        </div>
      </div>
      <div id='header-btn-area'>
        {!isLoggedIn && (
          <>
            <Button
              variant='success'
              onClick={() => {
                navigate('/about');
              }}
            >
              O Projeto
            </Button>
            <Button variant='success' onClick={() => navigate('/login')}>
              Login
            </Button>
          </>
        )}
        
        {isLoggedIn && (
          <>
            <Button
              variant='success'
              onClick={() => {
                navigate('/about');
              }}
            >
              O Projeto
            </Button>
            <Button variant='success' onClick={() => navigate('/chat')}>
              Chat
            </Button>
            <Button variant='success' onClick={() => navigate('/profile')}>
              Perfil
            </Button>
            <Button variant='success' onClick={handleLoginClick}>
              Sair
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
