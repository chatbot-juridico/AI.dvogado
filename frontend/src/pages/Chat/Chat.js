import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // TEMP

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import CloseButton from 'react-bootstrap/CloseButton';

import icon from '../../assets/icons/icon.png';
import menu from '../../assets/icons/menu.png';
import arrowUp from '../../assets/icons/arrow-up.png';

import api from '../../services/api';
import './Chat.scss';

function Chat() {
  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [showChats, setShowChats] = useState(false);
  const [currentChat, setCurrentChat] = useState();
  const [input, setInput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const divRef = useRef();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClose = () => setShowChats(false);
  const handleShow = () => setShowChats(true);

  useEffect(() => {
    if (!userId) {
      getUserId();
    }
  }, [userId]);

  useEffect(() => {
    if (chats.length > 0) {
      if (currentChat) {
        const chat = chats.find((chat) => chat.id === currentChat.id);
        setCurrentChat(chat);
        setTimeout(scrollDown, 100);
      } else {
        const lastChat = chats[chats.length - 1];
        setCurrentChat(lastChat);
      }
    }
  }, [chats]);

  useEffect(() => {
    if (currentChat) {
      if (currentChat.messages.length === 0) return;
      const lastMessage = currentChat.messages[currentChat.messages.length - 1];
      if (lastMessage.user !== 1) {
        getBotAnswer(lastMessage.text);
      }
    }
  }, [currentChat]);

  const getUserId = () => {
    const token = localStorage.getItem('authToken');
    api
      .post(`/api/user-details/`, { token })
      .then((res) => {
        const id = res.data.id;
        setUserId(id);
        getChats(id);
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  };

  const getChats = async (userId) => {
    setIsLoading(true);
    return await api
      .get(`api/chats-messages/?user_id=${userId}`)
      .then((res) => {
        setChats(res.data);
        setIsLoading(false);
        return res.data;
      })
      .catch((err) => {
        console.error('Erro: ', err);
      });
  };

  const selectChat = (id) => {
    const chat = chats.find((chat) => chat.id === id);
    setCurrentChat(chat);
    handleClose();
    setTimeout(scrollDown, 100);
  };

  const sendMessage = (message, user) => {
    api
      .post('api/messages/', { chat: currentChat.id, content: message, user: user })
      .then(() => {
        const updatedChats = chats.map((chat) => {
          if (chat.id === currentChat.id) {
            return {
              ...chat,
              messages: [...chat.messages, { content: message, user: user }],
            };
          }
          return chat;
        });
        setChats(updatedChats);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error:' + err);
      })
      .finally(() => {
        setInput('');
      });
  };

  const getBotAnswer = async (message) => {
    setIsLoading(true);
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
      const content = response.data[0].text;
      const botId = 1;
      sendMessage(content, botId);
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
    setIsExpanded(!isExpanded);
  };

  const scrollDown = () => {
    const div = divRef.current;
    div.scrollTop = div.scrollHeight + div.clientHeight;
  };

  const createChat = (user) => {
    api
      .post('api/chats/', { title: `Novo Chat`, user: user })
      .then(async (res) => {
        const allChats = await getChats(userId);
        const newChat = allChats.find((chat) => chat.id === res.data.id);
        setCurrentChat(newChat);
      })
      .catch((err) => {
        console.error('Erro: ', err);
      });
  };

  const deleteChats = (chatId) => {
    const deleteAll = !chatId;

    for (let index = 0; index < chats.length; index++) {
      const chat = chats[index];
      if (deleteAll || chat.id === chatId) {
        api
          .delete(`api/chats/${chat.id}`)
          .then(async () => {
            if ((index === chats.length - 1 && deleteAll) || (!deleteAll && chats.length === 1)) {
              createChat(userId);
              handleClose();
            }
            const allChats = await getChats(userId);
            if (currentChat.id === chatId) {
              const newCurrentChat = allChats[allChats.length - 1];
              setCurrentChat(newCurrentChat);
            }
          })
          .catch((err) => {
            console.error('Error:' + err);
          });
      }
    }
  };

  return (
    <Row id='content'>
      {/* CHAT */}
      {!isExpanded ? (
        <Col lg={11} md={12}>
          <Card
            style={{
              padding: '25px',
              backgroundColor: 'rgb(73 211 168)',
              gap: '25px',
            }}
          >
            <Offcanvas show={showChats} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Suas Conversas</Offcanvas.Title>
              </Offcanvas.Header>
              <Button
                style={{ width: 'fit-content', marginLeft: '12px' }}
                onClick={() => createChat(userId)}
              >
                + Nova Conversa
              </Button>
              <hr></hr>
              <Offcanvas.Body>
                <ListGroup>
                  {chats?.map(function (chat, idx) {
                    return (
                      <ListGroup.Item
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Button variant='Link' onClick={() => selectChat(chat.id)}>
                          {chat.title}
                        </Button>
                        <CloseButton onClick={() => deleteChats(chat.id)} />
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    width: '91%',
                    textAlign: 'center',
                  }}
                >
                  <Button variant='danger' onClick={() => deleteChats()}>
                    Excluir todas as conversas
                  </Button>
                </div>
              </Offcanvas.Body>
            </Offcanvas>

            <Card>
              <Card.Body style={{ backgroundColor: '#E9E9E9' }}>
                <Card.Title
                  style={{
                    backgroundColor: '#D2D2D2',
                    marginBottom: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button variant='link' onClick={handleShow}>
                    <img
                      style={{
                        width: '30px',
                        height: '30px',
                        transition: 'transform 0.3s ease-in-out',
                      }}
                      src={menu}
                      alt='*'
                    />
                  </Button>
                  <h2 style={{ marginBottom: 0 }}>Chat</h2>
                  <div style={{ width: '56px' }}></div>
                </Card.Title>
                <div
                  ref={divRef}
                  style={{
                    overflow: 'auto',
                    height: '450px',
                    backgroundColor: '#FFF',
                    padding: '15px 0',
                  }}
                >
                  {currentChat?.messages?.map(function (message, idx) {
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
                        <span>{message.content}</span>
                      </Card.Text>
                    );
                  })}
                  {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                      <Spinner animation='border' variant='primary' />
                    </div>
                  )}
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
                    onClick={() => sendMessage(input, userId)}
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
                      src={arrowUp}
                      alt='->'
                    ></img>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Card>
        </Col>
      ) : (
        <Col lg={9} md={12}>
          <Card
            style={{
              padding: '25px',
              backgroundColor: 'rgb(73 211 168)',
              gap: '25px',
            }}
          >
            <Offcanvas show={showChats} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Suas Conversas</Offcanvas.Title>
              </Offcanvas.Header>
              <Button
                style={{ width: 'fit-content', marginLeft: '12px' }}
                onClick={() => createChat(userId)}
              >
                + Nova Conversa
              </Button>
              <hr></hr>
              <Offcanvas.Body>
                <ListGroup>
                  {chats?.map(function (chat, idx) {
                    return (
                      <ListGroup.Item
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Button variant='Link' onClick={() => selectChat(chat.id)}>
                          {chat.title}
                        </Button>
                        <CloseButton onClick={() => deleteChats(chat.id)} />
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    width: '91%',
                    textAlign: 'center',
                  }}
                >
                  <Button variant='danger' onClick={() => deleteChats()}>
                    Excluir todas as conversas
                  </Button>
                </div>
              </Offcanvas.Body>
            </Offcanvas>

            <Card>
              <Card.Body style={{ backgroundColor: '#E9E9E9' }}>
                <Card.Title
                  style={{
                    backgroundColor: '#D2D2D2',
                    marginBottom: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button variant='link' onClick={handleShow}>
                    <img
                      style={{
                        width: '30px',
                        height: '30px',
                        transition: 'transform 0.3s ease-in-out',
                      }}
                      src={menu}
                      alt='*'
                    />
                  </Button>
                  <h2 style={{ marginBottom: 0 }}>Chat</h2>
                  <div style={{ width: '56px' }}></div>
                </Card.Title>
                <div
                  ref={divRef}
                  style={{
                    overflow: 'auto',
                    height: '450px',
                    backgroundColor: '#FFF',
                    padding: '15px 0',
                  }}
                >
                  {currentChat?.messages?.map(function (message, idx) {
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
                        <span>{message.content}</span>
                      </Card.Text>
                    );
                  })}
                  {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                      <Spinner animation='border' variant='primary' />
                    </div>
                  )}
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
                    onClick={() => sendMessage(input, userId)}
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
                      src={arrowUp}
                      alt='->'
                    ></img>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Card>
        </Col>
      )}

      {/* SOBRE */}
      {!isExpanded ? (
        <Col lg={1} md={12}>
          <Card style={{ height: '75.5vh' }}>
            <Card.Body
              style={{
                backgroundColor: 'rgb(73 211 168)',
                padding: '10px 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Button variant='link' onClick={toggleMenu}>
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '50px',
                  padding: '10px',
                  paddingBottom: '40px',
                }}
              >
                <Button as='a' href='https://github.com/chatbot-juridico/Aplicacao' target='_blank'>
                  Repo
                </Button>
                <Button
                  as='a'
                  href='https://www.overleaf.com/project/6525f5f3a97e1300b8317ee7'
                  target='_blank'
                >
                  Art.
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ) : (
        <Col lg={3} md={12}>
          <Card style={{ height: '75.5vh' }}>
            <Card.Body
              style={{
                backgroundColor: 'rgb(73 211 168)',
                padding: '10px 0',
              }}
            >
              <Button variant='link' onClick={toggleMenu}>
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
              <Card.Title>Sobre</Card.Title>
              <Card.Text style={{ padding: ' 0 40px' }}>
                Esse chatbot é o resultado de um trabalho de conclusão de curso realizado por
                graduandos da Faculdade do Gama da Universidade de Brasília, com o tema “Utilização
                de Large Language Models no desenvolvimento de um chatbot para consultoria
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
                  flexDirection: 'column',
                  gap: '50px',
                  padding: '0 50px',
                  paddingBottom: '40px',
                }}
              >
                <Button as='a' href='https://github.com/chatbot-juridico/Aplicacao' target='_blank'>
                  Repositório
                </Button>
                <Button
                  as='a'
                  href='https://www.overleaf.com/project/6525f5f3a97e1300b8317ee7'
                  target='_blank'
                >
                  Artigo
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      )}
    </Row>
  );
}

export default Chat;
