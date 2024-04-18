import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ListGroup from 'react-bootstrap/ListGroup';

import api from '../../services/api';

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
        const response = await api.post(`/api/user-details/`, { token });
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

  const handleInputChange = (e, field) => {
    setFeedbackData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    await api
      .post('/api/feedbacks/', feedbackData)
      .then(() => {
        setFeedbackData({
          email: '',
          content: '',
        });
      })
      .catch((error) => {
        console.error('Ocorreu um erro: ', error);
        setError('Erro:', error);
      });
  };

  return (
    <div style={{ backgroundColor: '#EFF', padding: '50px 0', minHeight: '89vh' }}>
      <Card style={{ margin: '0 30%' }}>
        <Card.Body>
          <Card.Title>
            <h1>Enviar Feedback</h1>
          </Card.Title>
          <Form onSubmit={handleSubmit} style={{ margin: '0 50px' }}>
            <FloatingLabel label='Email' className='mb-3'>
              <Form.Control
                type='email'
                value={feedbackData.email}
                onChange={(e) => {
                  handleInputChange(e, 'email');
                }}
                placeholder='email'
                required
              />
            </FloatingLabel>

            <FloatingLabel label='Mensagem' className='mb-3'>
              <Form.Control
                style={{ height: '200px' }}
                as='textarea'
                value={feedbackData.content}
                onChange={(e) => {
                  handleInputChange(e, 'content');
                }}
                placeholder='sua mensagem'
                required
              />
            </FloatingLabel>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='d-grid' style={{ marginBottom: '25px' }}>
              <Button type='submit'>Enviar Feedback</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Feedback list */}
      {feedbacks?.length > 0 && (
        <Card style={{ margin: '50px 10%' }}>
          <Card.Body>
            <Card.Title>
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
