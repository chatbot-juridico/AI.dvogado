import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import api from '../../services/api';

import './SignIn.css';

function SignIn() {
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({
    username: '',
    email: '',
    is_staff: false,
    password: '',
  });
  const [error, setError] = useState();

  const handleInputChange = (e, field) => {
    setSignInData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await api
      .post('/api/users/', signInData)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Ocorreu um erro: ', error);
        setError('Erro:', error);
      });
  };

  return (
    <div className='signin-container'>
      <Card className='card-container'>
        <Card.Body>
          <Card.Title className='title'>
            <h1>Cadastro</h1>
          </Card.Title>
          <Form onSubmit={handleSubmit} className='form'>
            <FloatingLabel label='Usuário' className='form-input'>
              <Form.Control
                value={signInData.username}
                placeholder='usuário'
                onChange={(e) => {
                  handleInputChange(e, 'username');
                }}
                required
              />
            </FloatingLabel>
            <FloatingLabel label='Email' className='form-input'>
              <Form.Control
                value={signInData.email}
                placeholder='email'
                onChange={(e) => {
                  handleInputChange(e, 'email');
                }}
                required
              />
            </FloatingLabel>
            <Form.Group className='form-input'>
              <Form.Check
                type='checkbox'
                value={signInData.is_staff}
                label='É administrador?'
                onChange={(e) => {
                  handleInputChange(e, 'is_staff');
                }}
              />
            </Form.Group>
            <FloatingLabel label='Senha' className='form-input'>
              <Form.Control
                type='password'
                value={signInData.password}
                placeholder='senha'
                onChange={(e) => {
                  handleInputChange(e, 'password');
                }}
                required
              />
            </FloatingLabel>
            {error && <p className='error-message'>{error}</p>}
            <div className='submit-button'>
              <Button type='submit'>Criar Conta</Button>
            </div>
          </Form>
          <div className='have-account'>
            <Button variant='secondary' onClick={() => navigate('/login')}>
              Já tem uma conta?
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SignIn;
