import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ListGroup from 'react-bootstrap/ListGroup';

import api from '../../services/api';

import './Feedback.css';

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
    <div className="feedback-container">
      <Card className="card-container">
        <Card.Body>
          <Card.Title className="title">
            <h1>Enviar Feedback</h1>
          </Card.Title>
          <Form onSubmit={handleSubmit} className="form">
            <FloatingLabel label='Email' className='form-input'>
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

            <FloatingLabel label='Mensagem' className='form-input'>
              <Form.Control
                style={{ height: '200px' }}
                as='textarea'
                value={feedbackData.content}
                onChange={(e) => {
                  handleChange(e, 'content');
                }}
                placeholder='sua mensagem'
                required
              />
            </FloatingLabel>
            {error && <p className="error-message">{error}</p>}
            <div className='submit-button'>
              <Button type='submit'>Enviar Feedback</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Feedback list */}
      {feedbacks?.length > 0 && (
        <Card className="feedback-list">
          <Card.Body>
            <Card.Title className="title">
              <h1>Feedbacks</h1>
            </Card.Title>
            <ListGroup variant='flush'>
              {feedbacks?.map(function (feedback, idx) {
                return (
                  <ListGroup.Item
                    as='li'
                    key={idx}
                    className='d-flex justify-content-between align-items-start'
                  >
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
    </div>
  );
}

export default Feedback;
