import React, { useState, useEffect, useRef } from 'react';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import api from '../../services/api';
import Button from 'react-bootstrap/Button';

import icon from '../../assets/icons/icon.png';
import menu from '../../assets/icons/menu.png';
import arrowForward from '../../assets/icons/arrow-forward.png';

import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState();
  const [input, setInput] = useState();
  const divRef = useRef();

  const scrollDown = () => {
    const div = divRef.current;
    div.scrollTop = div.scrollHeight + div.clientHeight;
  };

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = () => {
    api
      .get('api/chat/')
      .then((response) => {
        setMessages(response.data);
        setTimeout(scrollDown, 100);
      })
      .catch((err) => {
        console.error('Error:' + err);
      });
  };

  const sendMessage = () => {
    api
      .post('api/chat/', { text: input })
      .then(() => {
        getMessages();
      })
      .catch((err) => {
        console.error('Error:' + err);
      })
      .finally(() => {
        setInput('');
      });
  };

  const toggleMenu = (event) => {
    const icon = event.target;
    let currentRotation =
      parseInt(icon.style.transform.replace('rotate(', '').replace('deg)', ''), 10) || 0;
    currentRotation += 90;
    icon.style.transform = `rotate(${currentRotation}deg)`;
  };

  return (
    <Row id='content'>
      <Col lg={9} md={12}>
        <Card style={{ padding: '25px', backgroundColor: '#25ACA4', height: '100%', gap: '25px' }}>
          <Card style={{ height: '575px', maxHeight: '575px' }}>
            <Card.Body style={{ backgroundColor: '#E9E9E9' }}>
              <Card.Title style={{ backgroundColor: '#D2D2D2', marginBottom: '0' }}>
                <Button variant='link' onClick={($event) => toggleMenu($event)}>
                  <img
                    style={{
                      width: '30px',
                      height: '30px',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    src={menu}
                    alt='*'
                  ></img>
                </Button>
                Chat
              </Card.Title>
              <div ref={divRef} style={{ overflow: 'auto', height: '500px' }}>
                {messages?.map(function (res, idx) {
                  return (
                    <Card.Text key={idx}
                      style={{
                        margin: ' 10px 25%',
                        padding: '10px',
                        backgroundColor: '#FFF',
                        borderRadius: '15px',
                        display: 'flex',
                        gap: '15px',
                      }}
                    >
                      <img style={{ width: '45px', height: '45px' }} src={icon} alt='*'></img>
                      <span>
                        {res.text} - {res.created}
                      </span>
                    </Card.Text>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body style={{ backgroundColor: '#E9E9E9' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  margin: '25px 0',
                }}
              >
                <textarea
                  placeholder='Sua mensagem...'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{
                    width: '90%',
                    padding: '10px',
                    minHeight: '45px',
                  }}
                ></textarea>
                <Button
                  as='a'
                  variant='success'
                  onClick={() => sendMessage()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '45px',
                  }}
                >
                  <img
                    style={{
                      width: '20px',
                      height: '25px',
                    }}
                    src={arrowForward}
                    alt='->'
                  ></img>
                </Button>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>Versão 0.2 - Licença MIT</p>
              </div>
            </Card.Body>
          </Card>
        </Card>
      </Col>

      <Col lg={3} md={12}>
        <Card>
          <Card.Body style={{ backgroundColor: '#25ACA4', padding: '10px 0' }}>
            <Button variant='link' onClick={($event) => toggleMenu($event)}>
              <img
                style={{ width: '30px', height: '30px', transition: 'transform 0.3s ease-in-out' }}
                src={menu}
                alt='*'
              ></img>
            </Button>

            <Card.Title>Sobre</Card.Title>
            <Card.Text style={{ padding: ' 0 40px' }}>
              Esse chatbot é o resultado de um trabalho de conclusão de curso realizado por
              graduandos da Faculdade do Gama da Universidade de Brasília, com o tema “Utilização de
              Large Language Models no desenvolvimento de um chatbot para consultoria
              jurídico-trabalhista”.
            </Card.Text>
            <Card.Text style={{ padding: ' 0 40px' }}>
              Esse chatbot está sujeito a erros e não substitui uma consultoria real com um
              advogado.
            </Card.Text>
            <Card.Title>Links</Card.Title>
            <Card.Text style={{ padding: ' 0 40px' }}>Artigo</Card.Text>
            <Card.Text style={{ padding: ' 0 40px 10px' }}>GitHub</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Chat;
