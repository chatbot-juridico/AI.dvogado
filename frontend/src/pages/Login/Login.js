import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Container } from 'react-bootstrap';

import api from '../../services/api';
import styles from './Login.module.scss';

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState();

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
    <Container className={'content'}>
      <Card>
        <Card.Body>
          <Card.Title>
            <h1>Login</h1>
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <FloatingLabel label='Usuário' className={styles['form-input']}>
              <Form.Control
                value={loginData.username}
                onChange={(e) => {
                  handleInputChange(e, 'username');
                }}
                placeholder='usuário'
                required
              />
            </FloatingLabel>

            <FloatingLabel label='Senha' className={styles['form-input']}>
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
            {error && <p className={styles['error-message']}>{error}</p>}
            <Container className={styles['action-buttons']}>
              <Button type='submit'>Entrar</Button>
              <Button variant='secondary' type='button' onClick={() => navigate('/sign-in')}>
                Criar conta
              </Button>
            </Container>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
