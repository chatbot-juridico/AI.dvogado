import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Container } from 'react-bootstrap';

import api from '../../services/api';

import styles from './SignIn.module.scss';

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
        setError(error[0]);
      });
  };

  return (
    <Container className={styles['content']}>
      <Card>
        <Card.Body>
          <Card.Title>
            <h1>Cadastro</h1>
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <FloatingLabel label='Usuário' className={styles['form-input']}>
              <Form.Control
                value={signInData.username}
                placeholder='usuário'
                onChange={(e) => {
                  handleInputChange(e, 'username');
                }}
                required
              />
            </FloatingLabel>
            <FloatingLabel label='Email' className={styles['form-input']}>
              <Form.Control
                value={signInData.email}
                placeholder='email'
                onChange={(e) => {
                  handleInputChange(e, 'email');
                }}
                required
              />
            </FloatingLabel>
            <Form.Group className={styles['form-input']}>
              <Form.Check
                className={styles.checkbox}
                type='checkbox'
                value={signInData.is_staff}
                label='É administrador?'
                onChange={(e) => {
                  handleInputChange(e, 'is_staff');
                }}
              />
            </Form.Group>
            <FloatingLabel label='Senha' className={styles['form-input']}>
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
            {error && <p className={styles['error-message']}>{error}</p>}
            <Container className={styles['action-buttons']}>
              <Button type='submit'>Criar Conta</Button>
              <Button variant='secondary' type='button' onClick={() => navigate('/login')}>
                Já tem uma conta?
              </Button>
            </Container>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SignIn;
