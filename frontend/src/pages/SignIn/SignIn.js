import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import api from '../../services/api';
import './SignIn.css';

function SignIn() {
  const usernameRef = useRef();
  const emailRef = useRef();
  const isAdminRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const signInData = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      is_staff: isAdminRef.current.value,
      password: passwordRef.current.value,
    };

    await api
      .post('/api/users/', signInData)
      .then((res) => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Ocorreu um erro: ', error);
        setError('Erro:', error);
      });
  };

  return (
    <div style={{ backgroundColor: '#EFF', padding: '100px 0', height: '100vh' }}>
      <Card style={{ margin: '0 30%' }}>
        <Card.Body>
          <Card.Title>
            <h1>Cadastro</h1>
          </Card.Title>
          <Form onSubmit={handleSubmit} style={{ margin: '0 50px' }}>
            <FloatingLabel label='Usuário' className='mb-3'>
              <Form.Control ref={usernameRef} placeholder='usuário' required />
            </FloatingLabel>
            <FloatingLabel label='Email' className='mb-3'>
              <Form.Control ref={emailRef} placeholder='email' required />
            </FloatingLabel>
            <Form.Group className='mb-3'>
              <Form.Check type='checkbox' ref={isAdminRef} label={'É administrador?'} />
            </Form.Group>
            <FloatingLabel label='Senha' className='mb-3'>
              <Form.Control type='password' ref={passwordRef} placeholder='senha' required />
            </FloatingLabel>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='d-grid' style={{ marginBottom: '25px' }}>
              <Button type='submit'>Criar Conta</Button>
            </div>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
            <Button variant='secondary' onClick={() => navigate('/login')}>Já tem uma conta?</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SignIn;
