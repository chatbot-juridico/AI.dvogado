import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import reload from '../../assets/icons/reload.png';
import clipboard from '../../assets/icons/clipboard.png';

import api from '../../services/api';
import './Chat.css';

function Chat() {
  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [showChats, setShowChats] = useState(false);
  const [currentChat, setCurrentChat] = useState();
  const [input, setInput] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const divRef = useRef();
  const [isExpanded, setIsExpanded] = useState(true);
  const [file, setFile] = useState(null);

  const handleClose = () => setShowChats(false);
  const handleShow = () => setShowChats(true);

  useEffect(() => {
    const getUserId = () => {
      const token = localStorage.getItem('authToken');
      api
        .get(`/api/user-details/?token=${token}`)
        .then((res) => {
          const id = res.data.id;
          setUserId(id);
          getChats(id);
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    };

    if (!userId) {
      getUserId();
    }
  }, [userId]);

  useEffect(() => {
    if (chats.length > 0) {
      if (currentChat) {
        const chat = chats.find((chat) => chat.id === currentChat.id);
        if (chat) {
          chat.messages = chat.messages.sort((a, b) => a.id - b.id);
          setCurrentChat(chat);
          setTimeout(scrollDown, 100);
        }
      } else {
        const lastChat = chats[chats.length - 1];
        setCurrentChat(lastChat);
      }
    }
  }, [chats, currentChat]);

  const sendMessage = useCallback(
    (message, user) => {
      api
        .post('api/messages/', { chat: currentChat.id, content: message, user: user })
        .then((res) => {
          const updatedChats = chats.map((chat) => {
            if (chat.id === currentChat.id) {
              return {
                ...chat,
                messages: [...chat.messages, res.data],
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
    },
    [chats, currentChat, setChats, setIsLoading, setInput]
  );

  useEffect(() => {
    const getBotAnswer = async () => {
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

    if (currentChat) {
      if (currentChat.messages.length === 0) return;
      const lastMessage = currentChat.messages[currentChat.messages.length - 1];
      if (lastMessage.user !== 1) {
        getBotAnswer();
      }
    }
  }, [currentChat]);

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
    const displayNumber = chats.length;
    api
      .post('api/chats/', { title: `Novo Chat ${displayNumber}`, user: user })
      .then(async (res) => {
        const allChats = await getChats(userId);
        let newChat = allChats.find((chat) => chat.id === res.data.id);
        newChat.messages = newChat.messages.sort((a, b) => a.id - b.id);
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

  const reloadAnswer = (message) => {
    api
      .delete(`api/messages/${message.id}`)
      .then(async () => {
        const allChats = await getChats(userId);
        const updatedChat = allChats.find((chat) => chat.id === currentChat.id);
        setCurrentChat(updatedChat);
      })
      .catch((err) => {
        console.error('Error:' + err);
      });
  };

  const copyToClipboard = async (message) => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleChangeFile = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUploadFile = async () => {
    if (file) {
      const data = new FormData();
      data.append('image', file);
      // data.append('url', 'https://storage.googleapis.com/api4ai-static/samples/ocr-1.png');

      const options = {
        method: 'POST',
        url: 'https://ocr43.p.rapidapi.com/v1/results',
        headers: {
          'X-RapidAPI-Key': '48969325c7msh182124cce3b96dap1c5a70jsn7bca8705e06e',
          'X-RapidAPI-Host': 'ocr43.p.rapidapi.com',
        },
        data: data,
      };

      try {
        const response = await axios.request(options);
        console.log(response.data.results[0].entities[0].objects[0].entities[0].text);
        const fileText = response.data.results[0].entities[0].objects[0].entities[0].text;
        setInput(input + ' documento: ' + fileText);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#EFF', padding: '45px 0', height: '89vh' }}>
      <Row id='content'>
        {/* CHAT */}
        <Col
          lg={isExpanded ? 9 : 11}
          md={12}
          style={{ display: 'flex', gap: '30px', flexDirection: 'column' }}
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
            <hr />
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

          <Card style={{ height: '60.5vh' }}>
            <Card.Body style={{ height: '100%' }}>
              <Card.Title
                style={{
                  backgroundColor: 'rgb(73 211 168)',
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
                <h2 style={{ marginBottom: 0 }}>
                  {currentChat?.title ? currentChat?.title : 'Chat'}
                </h2>
                <div style={{ width: '56px' }}></div>
              </Card.Title>
              <div
                ref={divRef}
                style={{
                  overflow: 'auto',
                  height: '88%',
                  backgroundColor: '#FFF',
                  padding: '15px 0',
                }}
              >
                {currentChat?.messages?.map(function (message, idx) {
                  const isBot = message.user === 1;
                  const isLastMessage = idx === currentChat?.messages?.length - 1;
                  return (
                    <Card.Text
                      key={idx}
                      style={{
                        margin: isBot ? '10px 10px 10px 175px' : '10px 175px 10px 10px',
                        padding: '10px',
                        backgroundColor: isBot ? '#FFD700' : '#EEE',
                        borderRadius: '15px',
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ display: 'flex', gap: '15px' }}>
                        <img style={{ width: '45px', height: '45px' }} src={icon} alt='*'></img>
                        <span>{message.content}</span>
                      </span>

                      {isBot && (
                        <span
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button as='a' variant='Link' onClick={() => copyToClipboard(message)}>
                            <img src={clipboard} alt='copy' style={{ height: '24px' }}></img>
                          </Button>
                          {isLastMessage && (
                            <Button as='a' variant='Link' onClick={() => reloadAnswer(message)}>
                              <img src={reload} alt='reload' style={{ height: '24px' }}></img>
                            </Button>
                          )}
                        </span>
                      )}
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
            <Card.Body style={{ backgroundColor: 'rgb(73 211 168)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                  margin: '25px 0',
                }}
              >
                <div style={{ width: '85%' }}>
                  <textarea
                    placeholder='Sua mensagem...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      minHeight: '45px',
                    }}
                  ></textarea>
                  <input
                    type='file'
                    style={{ width: '30%' }}
                    accept='.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    onChange={(event) => handleChangeFile(event)}
                  />
                  <Button onClick={() => handleUploadFile()}>Upload!</Button>
                </div>

                <Button
                  onClick={() => sendMessage(input, userId)}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '45px',
                    marginBottom: '47px',
                  }}
                >
                  <img
                    style={{
                      width: '25px',
                      height: '25px',
                    }}
                    src={arrowUp}
                    alt='->'
                  ></img>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* SOBRE */}
        {isExpanded && (
          <Col lg={3} md={12}>
            <Card style={{ height: '78vh', backgroundColor: 'rgb(73 211 168)' }}>
              <Card.Body
                style={{
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
                <Card.Title>
                  <h2>Sobre</h2>
                </Card.Title>
                <Card.Text style={{ padding: ' 0 40px' }}>
                  Esse chatbot é o resultado de um trabalho de conclusão de curso realizado por
                  graduandos da Faculdade do Gama da Universidade de Brasília, com o tema
                  “Utilização de Large Language Models no desenvolvimento de um chatbot para
                  consultoria jurídico-trabalhista”.
                </Card.Text>
                <Card.Text style={{ padding: ' 0 40px', fontWeight: 'bold' }}>
                  Esse chatbot está sujeito a erros e não substitui uma consultoria real com um
                  advogado.
                </Card.Text>
                <Card.Title>
                  <h3>Links</h3>
                </Card.Title>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '50px',
                    padding: '0 50px',
                    paddingBottom: '40px',
                  }}
                >
                  <Button
                    as='a'
                    href='https://github.com/chatbot-juridico/Aplicacao'
                    target='_blank'
                  >
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

        {!isExpanded && (
          <Col lg={1} md={12}>
            <Card style={{ height: '78vh', backgroundColor: 'rgb(73 211 168)' }}>
              <Card.Body
                style={{
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
                  <Button
                    as='a'
                    href='https://github.com/chatbot-juridico/Aplicacao'
                    target='_blank'
                  >
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
        )}
      </Row>
    </div>
  );
}

export default Chat;
