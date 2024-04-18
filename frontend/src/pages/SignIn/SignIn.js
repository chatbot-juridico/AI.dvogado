import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import api from '../../services/api';

function SignIn() {
  const [signInData, setSignInData] = useState({
    username: '',
    email: '',
    is_staff: false,
    password: '',
  });
  const [error, setError] = useState();
  const navigate = useNavigate();

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
    <div style={{ backgroundColor: '#EFF', padding: '100px 0', height: '89vh' }}>
      <Card style={{ margin: '0 30%' }}>
        <Card.Body>
          <Card.Title>
            <h1>Cadastro</h1>
          </Card.Title>
          <Form onSubmit={handleSubmit} style={{ margin: '0 50px' }}>
            <FloatingLabel label='Usuário' className='mb-3'>
              <Form.Control
                value={signInData.username}
                placeholder='usuário'
                onChange={(e) => {
                  handleInputChange(e, 'username');
                }}
                required
              />
            </FloatingLabel>
            <FloatingLabel label='Email' className='mb-3'>
              <Form.Control
                value={signInData.email}
                placeholder='email'
                onChange={(e) => {
                  handleInputChange(e, 'email');
                }}
                required
              />
            </FloatingLabel>
            <Form.Group className='mb-3'>
              <Form.Check
                type='checkbox'
                value={signInData.is_staff}
                label='É administrador?'
                onChange={(e) => {
                  handleInputChange(e, 'is_staff');
                }}
              />
            </Form.Group>
            <FloatingLabel label='Senha' className='mb-3'>
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='d-grid' style={{ marginBottom: '25px' }}>
              <Button type='submit'>Criar Conta</Button>
            </div>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
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
