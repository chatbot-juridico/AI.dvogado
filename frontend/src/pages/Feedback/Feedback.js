import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ListGroup from 'react-bootstrap/ListGroup';
import { Container } from 'react-bootstrap';
import styles from '../Home/Home.module.scss';

import api from '../../services/api';

import fstyles from './Feedback.module.scss';

function Feedback() {
  const [feedbackData, setFeedbackData] = useState({
    email: '',
    content: '',
  });
  const [feedbacks, setFeedbacks] = useState(null);
  const [error, setError] = useState();

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await api.get(`/api/user-details/?token=${token}`);
        const isAdmin = response.data.is_staff;
        if (isAdmin) {
          getFeedbacks();
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    if (localStorage.getItem('authToken')) {
      getUserData();
    }
  }, []);

  const handleChange = (e, field) => {
    setFeedbackData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const getFeedbacks = async () => {
    await api
      .get(`api/feedbacks/`)
      .then((res) => {
        setFeedbacks(res.data);
      })
      .catch((err) => {
        console.error('Erro: ', err);
      });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/api/feedbacks/', feedbackData);
      setFeedbackData({
        email: '',
        content: '',
      });
    } catch (error) {
      console.error('Ocorreu um erro: ', error);
      setError('Erro:', error);
    }
  };

  return (
    <div className={styles['content']}>
      <div className={styles['horizontal-banner']}>
        <div className={styles['banner-content']}>
          <p className={styles['banner-title']}>Sua opinião é importante para nós!</p>

          <p className={styles['banner-text']}>Agradecemos por dedicar um momento para compartilhar seus pensamentos conosco. Seu feedback nos ajuda a melhorar continuamente nossos serviços e garantir que sua experiência seja excepcional. Por favor, preencha o formulário abaixo e nos ajude a entender como podemos atendê-lo melhor.</p>
        </div>
      </div>

      <Form onSubmit={handleSubmit} className={fstyles['form']}>
        <FloatingLabel label='Email para contato' className={fstyles['form-input']}>
          <Form.Control
            type='email'
            value={feedbackData.email}
            onChange={(e) => {
              handleChange(e, 'email');
            }}
            placeholder='email'
            required
          />
        </FloatingLabel>

        <FloatingLabel label='No que podemos melhorar?' className={fstyles['form-input']}>
          <Form.Control
            style={{ height: '150px' }}
            as='textarea'
            value={feedbackData.content}
            onChange={(e) => {
              handleChange(e, 'content');
            }}
            placeholder='sua mensagem'
            required
          />
        </FloatingLabel>
        {error && <p className={'error-message'}>{error}</p>}
        <Button className={fstyles['submit-btn']} type='submit'>
          Enviar Feedback
        </Button>
      </Form>

      <Container>
        {/* Feedback list */}
        {feedbacks?.length > 0 && (
          <Card>
            <Card.Body>
              <Card.Title>
                <h3>Feedbacks</h3>
              </Card.Title>
              <ListGroup variant='flush'>
                {feedbacks?.map(function (feedback, idx) {
                  return (
                    <ListGroup.Item as='li' key={idx} className='d-flex justify-content-between align-items-start'>
                      <div className='ms-2 me-auto'>
                        <div className='fw-bold'>{feedback.email}</div>
                        {feedback.content}
                      </div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default Feedback;
