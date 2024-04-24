import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import api from '../../services/api';

import styles from './Login.module.css';

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
    <div className={styles.container}>
      <Card className={styles.card}>
        <Card.Body>
          <Card.Title className={styles.title}>
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
            <div className={styles['submit-button']}>
              <Button type='submit'>Entrar</Button>
            </div>
          </Form>
          <div className={styles['create-account']}>
            <Button variant='secondary' onClick={() => navigate('/sign-in')}>
              Criar conta
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
