import React from 'react';
import Button from 'react-bootstrap/Button';

import './Header.css';

function Header() {
  let isAtChat = true;
  let btnText;
  if (isAtChat) {
    btnText = 'O Projeto';
  } else {
    btnText = 'Chat';
  }

  const navigateToPage = (destination) => {
    console.log('Navegando', destination)
  }

  return (
    <div id='header'>
      <div id='header-area'>
        <img id='logo' alt='Logo'></img>
        <div id='header-title-area'>
          <h1 id='title'>Nome do Produto</h1>
          <p id='subtitle'>Seu assistente jurídico-trabalhista</p>
        </div>
      </div>
      <div id='header-btn-area'>
        <Button as='a' variant='success' onClick={() => navigateToPage(btnText)}>
          {btnText}
        </Button>
      </div>
    </div>
  );
}

export default Header;
