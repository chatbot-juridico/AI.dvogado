import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

import SuccessModal from '../../components/SuccessModal';

import person from '../../assets/icons/person.png';
import api from '../../services/api';
import './Profile.css';

function Profile() {
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUserData();
  }, [navigate]);

  const getUserData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await api.post(`/api/user-details/`, { token });
      const user = response.data;
      setUserData({ id: user.id, username: user.username, email: user.email, password: '' });
    } catch (err) {
      console.error('Error:', err);
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <Card style={{ padding: '25px', backgroundColor: 'rgb(73 211 168)', margin: '25px 25%' }}>
      <Card>
        <Card.Body style={{ backgroundColor: '#E9E9E9' }}>
          <Card.Title>
            <h1>Perfil</h1>
          </Card.Title>
          <div style={{ padding: '0 25px', display: 'flex' }}>
            <div>
              <img style={{ width: '220px', height: '220px' }} src={person} alt='*'></img>
            </div>

            <div style={{ marginLeft: '25px' }}>
              <Form style={{ margin: '0 50px' }}>
                <FloatingLabel label='Usuário' className='mb-3'>
                  <Form.Control
                    name='username'
                    value={userData.username}
                    onChange={handleChange}
                    placeholder='usuário'
                    required
                  />
                </FloatingLabel>
                <FloatingLabel label='Email' className='mb-3'>
                  <Form.Control
                    name='email'
                    value={userData.email}
                    onChange={handleChange}
                    placeholder='email'
                    required
                  />
                </FloatingLabel>
                <FloatingLabel label='Nova Senha' className='mb-3'>
                  <Form.Control
                    type='password'
                    name='password'
                    value={userData.password}
                    onChange={handleChange}
                    placeholder='nova senha'
                    required
                  />
                </FloatingLabel>
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </Form>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '50px',
              justifyContent: 'center',
              marginBottom: '10px',
              marginRight: '50px',
              float: 'right',
            }}
          >
            <Button as='a' variant='danger' onClick={handleDelete}>
              Excluir conta
            </Button>
            <Button as='a' onClick={handleEdit}>
              Salvar Alterações
            </Button>
          </div>
        </Card.Body>
      </Card>
      <SuccessModal show={showSuccessModal} handleClose={handleCloseSuccessModal} />
    </Card>
  );
}

export default Profile;
