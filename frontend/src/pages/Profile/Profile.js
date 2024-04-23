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
    <div className='profile-container'>
      <Card className='card-container'>
        <Card.Body>
          <Card.Title className='title'>
            <h1>Perfil</h1>
          </Card.Title>
          <div className='profile-form'>
            <div>
              <img className='profile-image' src={person} alt='*'></img>
            </div>

            <div className='form-input'>
              <Form>
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
                {error && <p className='error-message'>{error}</p>}
              </Form>
            </div>
          </div>

          <div className='action-buttons'>
            <Button variant='danger' onClick={handleDelete}>
              Excluir conta
            </Button>
            <Button disabled={disableSubmit()} onClick={handleEdit}>
              Salvar Alterações
            </Button>
          </div>
        </Card.Body>
      </Card>
      <SuccessModal show={showSuccessModal} handleClose={handleCloseSuccessModal} />
    </div>
  );
}

export default Profile;
