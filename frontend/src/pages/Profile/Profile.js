import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import SuccessModal from '../../components/SuccessModal';

import api from '../../services/api';

import styles from './Profile.module.scss';
import { Container } from 'react-bootstrap';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await api.get(`/api/user-details/?token=${token}`);
        const user = response.data;
        setUserData({ id: user.id, username: user.username, email: user.email, password: '' });
      } catch (err) {
        console.error('Error:', err);
      }
    };

    getUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/users/${userData.id}/`);
      localStorage.removeItem('authToken');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Ocorreu um erro: ', error);
      setError('Erro:', error);
    }
  };

  const handleEdit = async () => {
    const editUserData = {
      username: userData.username,
      email: userData.email,
    };
    if (userData.password) {
      editUserData.password = userData.password;
    }

    try {
      await api.put(`/api/users/${userData.id}/`, editUserData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Ocorreu um erro: ', error);
      setError('Erro:', error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const disableSubmit = () => {
    return !userData.username.trim() || !userData.email.trim();
  };

  return (
    <Container className={styles['content']}>
      <Card>
        <Card.Body>
          <Card.Title>
            <h1>Perfil</h1>
          </Card.Title>
          <Form>
            <FloatingLabel label='Usuário' className={styles['form-input']}>
              <Form.Control
                name='username'
                value={userData.username}
                onChange={handleChange}
                placeholder='usuário'
                required
              />
            </FloatingLabel>
            <FloatingLabel label='Email' className={styles['form-input']}>
              <Form.Control
                name='email'
                value={userData.email}
                onChange={handleChange}
                placeholder='email'
                required
              />
            </FloatingLabel>
            <FloatingLabel label='Nova Senha' className={styles['form-input']}>
              <Form.Control
                type='password'
                name='password'
                value={userData.password}
                onChange={handleChange}
                placeholder='nova senha'
                required
              />
            </FloatingLabel>
            {error && <p className={styles['error-message']}>{error}</p>}
          </Form>

          <div className={styles['action-buttons']}>
            <div className={styles['submit-button']}>
              <Button disabled={disableSubmit()} onClick={handleEdit}>
                Salvar Alterações
              </Button>
            </div>
            <div className={styles['delete-button']}>
              <Button variant='danger' onClick={handleDelete}>
                Excluir conta
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      <SuccessModal show={showSuccessModal} handleClose={handleCloseSuccessModal} />
    </Container>
  );
}

export default Profile;
