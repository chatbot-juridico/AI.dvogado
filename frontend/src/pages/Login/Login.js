import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import api from '../../services/api';

function Login() {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleInputChange = (e, field) => {
    setLoginData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await api
      .post('/api-auth/login/', loginData)
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem('authToken', token);
        navigate('/chat');
      })
      .catch((error) => {
        console.error('Ocorreu um erro: ', error);
        setError('Usuário ou senha incorretos.');
      });
  };

  return (
    <div style={{ backgroundColor: '#EFF', padding: '100px 0', height: '89vh' }}>
      <Card style={{ margin: '0 30%' }}>
        <Card.Body>
          <Card.Title>
            <h1>Login</h1>
          </Card.Title>
          <Form onSubmit={handleSubmit} style={{ margin: '0 50px' }}>
            <FloatingLabel label='Usuário' className='mb-3'>
              <Form.Control
                value={loginData.username}
                onChange={(e) => {
                  handleInputChange(e, 'username');
                }}
                placeholder='usuário'
                required
              />
            </FloatingLabel>

            <FloatingLabel label='Senha' className='mb-3'>
              <Form.Control
                type='password'
                value={loginData.password}
                onChange={(e) => {
                  handleInputChange(e, 'password');
                }}
                placeholder='senha'
                required
              />
            </FloatingLabel>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='d-grid' style={{ marginBottom: '25px' }}>
              <Button type='submit'>Entrar</Button>
            </div>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
            <Button onClick={() => navigate('/sign-in')}>Criar conta</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
