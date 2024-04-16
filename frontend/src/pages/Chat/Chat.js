import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // TEMP

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

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = () => {
    api.get('api/chat/').then((response) => {
      if (response.data.length == 0) return;
      setMessages(response.data);
      const lastMessage = response.data[response.data.length - 1];
      if (lastMessage.user !== 1) {
        getBotAnswer(lastMessage.text);
      }
      setTimeout(scrollDown, 100);
    });
  };

  const sendMessage = (message, user) => {
    api
      .post('api/chat/', { text: message, user })
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

  const getBotAnswer = async (message) => {
    const options = {
      method: 'GET',
      url: 'https://famous-quotes4.p.rapidapi.com/random',
      params: {
        category: 'all',
        count: '1',
      },
      headers: {
        'X-RapidAPI-Key': '48969325c7msh182124cce3b96dap1c5a70jsn7bca8705e06e',
        'X-RapidAPI-Host': 'famous-quotes4.p.rapidapi.com',
      },
    };
    try {
      const response = await axios.request(options);
      sendMessage(response.data[0].text, 1);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMenu = (event) => {
    const icon = event.target;
    let currentRotation =
      parseInt(icon.style.transform.replace('rotate(', '').replace('deg)', ''), 10) || 0;
    currentRotation += 90;
    icon.style.transform = `rotate(${currentRotation}deg)`;
  };

  const scrollDown = () => {
    const div = divRef.current;
    div.scrollTop = div.scrollHeight + div.clientHeight;
  };

  return (
    <Row id='content'>
      <Col lg={9} md={12}>
        <Card
          style={{
            padding: '25px',
            backgroundColor: 'rgb(73 211 168)',
            height: '100%',
            gap: '25px',
          }}
        >
          <Card style={{ height: '545px', maxHeight: '545px' }}>
            <Card.Body style={{ backgroundColor: '#E9E9E9' }}>
              <Card.Title style={{ backgroundColor: '#D2D2D2', marginBottom: '0' }}>
                Chat
              </Card.Title>
              <div
                ref={divRef}
                style={{
                  overflow: 'auto',
                  height: '500px',
                  backgroundColor: '#FFF',
                  padding: '15px 0',
                }}
              >
                {messages?.map(function (message, idx) {
                  const isBot = message.user === 1;
                  return (
                    <Card.Text
                      key={idx}
                      style={{
                        margin: isBot ? '10px 10px 10px 175px' : '10px 175px 10px 10px',
                        padding: '10px',
                        backgroundColor: isBot ? '#FFD700' : '#EEE',
                        borderRadius: '15px',
                        display: 'flex',
                        gap: '15px',
                      }}
                    >
                      <img style={{ width: '45px', height: '45px' }} src={icon} alt='*'></img>
                      <span>{message.text}</span>
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
                  onClick={() => sendMessage(input)}
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
            </Card.Body>
          </Card>
        </Card>
      </Col>

      <Col lg={3} md={12}>
        <Card>
          <Card.Body style={{ backgroundColor: 'rgb(73 211 168)', padding: '10px 0' }}>
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
            <Card.Text style={{ padding: ' 0 40px', fontWeight: 'bold' }}>
              Esse chatbot está sujeito a erros e não substitui uma consultoria real com um
              advogado.
            </Card.Text>
            <Card.Title>Links</Card.Title>
            <div
              style={{
                display: 'flex',
                gap: '50px',
                justifyContent: 'center',
                marginBottom: '10px',
              }}
            >
              <Button as='a' href='https://github.com/chatbot-juridico/Aplicacao'>
                Repositório
              </Button>
              <Button as='a' href='https://www.overleaf.com/project/6525f5f3a97e1300b8317ee7'>
                Artigo
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Chat;
